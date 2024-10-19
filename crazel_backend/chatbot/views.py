# chatbot/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationSerializer
import os
from django.conf import settings
import shutil
import logging
from dotenv import load_dotenv
import openai
import re
from django.http import HttpResponse
import requests
import json


# Set up logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
endpoint = os.getenv("ENDPOINT_URL", "https://husky-m2813bok-westeurope.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-35-turbo")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "REPLACE_WITH_YOUR_KEY_VALUE_HERE")
github_token = os.getenv("GITHUB_TOKEN", "REPLACE_WITH_YOUR_GITHUB_TOKEN")


# Configure OpenAI
openai.api_type = "azure"
openai.api_key = subscription_key
openai.api_base = endpoint
openai.api_version = "2024-05-01-preview"

class BuildAppAPIView(APIView):

    def call_azure_openapi(self, messages):
        """Call Azure OpenAI API to generate the app code."""
        try:
            response = openai.ChatCompletion.create(
                engine=deployment,
                messages=messages,
                max_tokens=4000,
                temperature=0.7,
                top_p=0.95,
                frequency_penalty=0,
                presence_penalty=0
            )
            return response['choices'][0]['message']['content'].strip()
        except Exception as e:
            logger.error(f"Failed to call Azure OpenAI API: {e}")
            raise

    def post(self, request):
        chat_history = request.data.get('chatHistory')
        appname = request.data.get('appName')
        if not chat_history:
            logger.warning('No chat history provided in the request.')
            return Response({"error": "No chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate a prompt based on the chat history
            prompt = self.create_prompt(appname, chat_history)
            print(f'the full prompt is {prompt}')
            if not prompt:
                logger.error('Failed to create a prompt from the chat history.')
                return Response({"error": "Invalid chat history provided."}, status=status.HTTP_400_BAD_REQUEST)
            
            with open('chatbot_system_message.txt', 'r') as file:
                chatbot_system_message = file.read()

            # Prepare messages for the Azure OpenAI API
            messages = [
                {"role": "system", "content": chatbot_system_message},
                {"role": "user", "content": prompt}
            ]

            # Generate the Flutter app code using Azure OpenAI
            app_files = None
            app_files = self.call_azure_openapi(messages)
            print(f'the response received from openai is {app_files}')
            create_flutter_files(app_files, appname,dartpad=True)
            gist_url = self.create_gist(appname)
            print(f"Gist created at {gist_url}")
            

            print('App has been generated successfully.')
            return Response({
            "success": True,
            "message": "App has been generated successfully.",
            "gist_url": gist_url
        }, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"Configuration error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception('An error occurred while building the app.')
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def create_gist(self, appname):
        """
        Upload the Dart file as a public GitHub Gist.
        
        :param dart_code: Dart code content as a string
        :param file_name: Name of the Dart file (e.g., 'main.dart')
        :return: URL of the created Gist
        """

        # base_dir = f'generate_apps/{appname}/dartpad_main.dart'

        print('call is hereeee11')
        
        # if not os.path.exists(base_dir):
        #     print(f"Error: File not found at {base_dir}")
        #     return None

        # Read the content of the Dart file
        # with open(base_dir, 'r') as file:
        #     dart_code = file.read()

        # with open('dartpadcodecreation.txt', 'r') as file:
        #         prompt_body = file.read()
        
        # with open('chatbot_system_message.txt', 'r') as file:
        #         chatbot_system_message = file.read()

        # Combine the user inputs (requirements_text) with the prompt body
        # dartpad_prompt = f"""

        # {prompt_body}
        # {dart_code}
        # """

        # if not dartpad_prompt:
        #         logger.error('Failed to create and send the dart pad prompt')
        #         return Response({"error": "Invalid chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

        #     # Prepare messages for the Azure OpenAI API
        # messages = [
        #     {"role": "system", "content": chatbot_system_message},
        #     {"role": "user", "content": dartpad_prompt}
        # ]

        # Generate the Flutter app code using Azure OpenAI
        #app_files = self.call_azure_openapi(messages)
        #create_flutter_files(app_files, appname, dartpad=True)

        dartpad_dir = f'generate_apps/{appname}/dartpad_main.dart'

        if not os.path.exists(dartpad_dir):
            print(f"Error: File not found at {dartpad_dir}")
            return None

        with open(dartpad_dir, 'r') as file:
            dartpad_main = file.read()


        # API endpoint for creating a Gist
        url = "https://api.github.com/gists"
        
        # Gist file content in JSON format
        payload = {
            "description": "Dart code uploaded via API",
            "public": True,  # Public Gist
            "files": {
                f"{appname}_main.dart": {
                    "content": dartpad_main
                }
            }
        }

        # GitHub token for authentication
        headers = {
            "Authorization": f"token {github_token}",
            "Content-Type": "application/json"
        }

        # Make the POST request to GitHub API
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        # Check if the request was successful
        if response.status_code == 201:
            gist_url = response.json()["html_url"]
            print(f"Gist created successfully: {gist_url}")
            return gist_url
        else:
            print(f"Error: {response.status_code} - {response.json()}")
            return None

    def get_extract_rephrased_answer(self, chat_history):
            confirmed_texts = []
            rephrasetext = None
            for item in chat_history:
                # Check if the item is a dictionary with 'text' and 'sender' keys
                if isinstance(item, dict) and 'text' in item:
                    # Check if the text contains "You confirmed"
                    if "You confirmed" in item['text']:
                        confirmed_texts.append(item['text'])

            if confirmed_texts:
                print("Confirmed Texts:")
                for idx, text in enumerate(confirmed_texts, 1):
                    rephrasetext = text
            return rephrasetext


# Extract and print texts containing "You confirmed"
    def create_prompt(self, appname, chat_history):
        """Create a detailed prompt based on user requirements."""
        user_requirements = []
        rephrasetext = self.get_extract_rephrased_answer(chat_history)
        for entry in chat_history:
            if isinstance(entry, dict):
                question = entry.get('question')
                answer = entry.get('answer')
                if question and answer:
                    user_requirements.append(f"{question}: {answer}")
        if user_requirements:
            requirements_text = '\n'.join(user_requirements)
            with open('dartpadcodecreation.txt', 'r') as file:
                prompt_body = file.read()

            # Combine the user inputs (requirements_text) with the prompt body
            complete_prompt = f"""
            Create a Dart file for a Flutter application with  the name {appname} and that meets the following user requirements and is optimized for smooth performance in DartPad with the following deails:
            
            Main intent : 
            {rephrasetext}

            User Requirements:
            {requirements_text}

            App design principles : 
            {prompt_body}
            """
            print(f"the complete_prompt prompt {complete_prompt}")
            return complete_prompt
        else:
            logger.warning('Chat history does not contain valid user requirements.')
            return None
    

def clean_dart_code(dart_code):
    """
    Clean the Dart code extracted from the OpenAI response.
    
    :param dart_code: The raw Dart code from OpenAI's response.
    :return: Cleaned Dart code, without markdown or extra characters.
    """
    # Remove triple backticks (```dart or ```) and any surrounding extra spaces or newlines
    dart_code = re.sub(r'```dart|```', '', dart_code).strip()

    # Ensure the code starts with 'import' or 'void main()' (basic Dart code check)
    if not dart_code.startswith('import') and 'void main()' not in dart_code:
        raise ValueError("The extracted code doesn't appear to be valid Dart code.")
    
    return dart_code
# Function to parse and write main.dart and pubspec.yaml files
def create_flutter_files(response, appname, dartpad=False):
    if not dartpad:
        base_dir = f'generate_apps/{appname}/lib'
    else:
        base_dir = f'generate_apps/{appname}/'

    
    # Ensure base directory exists for main.dart
    os.makedirs(base_dir, exist_ok=True)

    # Extract main.dart content from the response
    main_dart_content = None

    # Split the response into sections based on the template
    if '```dart' in response:
        sections = response.split('```dart')  # Separate based on code block with dart
    else:
        sections = response.split('```')  # Separate based on generic code block
    
    print(f"the sections is {sections}")


    # Extract main.dart content
    # if len(sections) >= 2:
    #     main_dart_content = sections[1].strip().rstrip('```').strip()  # Extract content between code block markers

    # # Ensure required content is found
    # if not main_dart_content:
    #     print("Required content for main.dart not found in the response.")
    #     return

    try:
        main_dart_content = clean_dart_code(response)
        print(f"the main code is {main_dart_content}")
    except ValueError as ve:
        print(f"Validation error: {ve}")
        return
    
    
    # Write main.dart content to file
    if not dartpad:
        file_name = "main.dart"
    else:
        file_name = "dartpad_main.dart"
    main_dart_path = os.path.join(base_dir, file_name)
    with open(main_dart_path, 'w') as file:
        file.write(main_dart_content)
    print(f"{file_name}.dart file created at {main_dart_path}")

    # Validate and clean the Dart file
    validate_dart_file(main_dart_path)
    if not dartpad:
        generate_pubspec_yaml(appname)
    

def generate_pubspec_yaml(appname):
    main_dart_path = f'generate_apps/{appname}/lib/main.dart'
    dependencies = set()

    # Read the main.dart file to determine dependencies
    with open(main_dart_path, 'r') as file:
        for line in file:
            match = re.match(r"import\s+[\'\"]package:([a-z_]+)\/", line)
            if match:
                dependencies.add(match.group(1))

    # Ensure 'flutter' dependency is present without duplicates
    dependencies.add('flutter')

    # Create pubspec.yaml content dynamically
    pubspec_header = f"""
name: {appname}
description: A new Flutter project.
version: 1.0.0+1
environment:
  sdk: ">=2.17.0 <3.0.0"

dependencies:
"""
    pubspec_dependencies = generate_dependencies_content(dependencies)
    pubspec_footer = """
dev_dependencies:
  flutter_test:
    sdk: flutter

flutter:
  uses-material-design: true
  assets:
    - assets/
  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
"""

    # Merge header, dependencies, and footer
    pubspec_content = merge_pubspec_content(pubspec_header, pubspec_dependencies, pubspec_footer)
    
    # Write pubspec.yaml content to file
    base_app_dir = f'generate_apps/{appname}'
    os.makedirs(base_app_dir, exist_ok=True)
    pubspec_path = os.path.join(base_app_dir, 'pubspec.yaml')
    with open(pubspec_path, 'w') as file:
        file.write(pubspec_content)
    print(f"pubspec.yaml file created at {pubspec_path}")

def generate_dependencies_content(dependencies):
    pubspec_dependencies = ""
    for dependency in dependencies:
        if dependency == 'flutter':
            pubspec_dependencies += "  flutter:\n    sdk: flutter\n"
        else:
            pubspec_dependencies += f"  {dependency}: any\n"
    return pubspec_dependencies

def merge_pubspec_content(header, dependencies, footer):
    return f"{header}{dependencies}{footer}"


def validate_dart_file(file_path):
    # Read the file content
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Remove any unwanted characters or extra strings
    cleaned_content = content.strip()
    
    # Write the cleaned content back to the file
    with open(file_path, 'w') as file:
        file.write(cleaned_content)
    print(f"main.dart file validated and cleaned at {file_path}")



def get_main_dart(request, appname):
    file_path = f'generate_apps/{appname}/lib/main.dart'
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
        return HttpResponse(content, content_type="text/plain")
    else:
        return HttpResponse("main.dart not found", status=404)

def get_pubspec_yaml(request, appname):
    file_path = f'generate_apps/{appname}/pubspec.yaml'
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            content = file.read()
        return HttpResponse(content, content_type="text/plain")
    else:
        return HttpResponse("pubspec.yaml not found", status=404)



class RephraseAPIView(APIView):

    def call_azure_openapi(self, messages):
        """Call Azure OpenAI API to generate the app code."""
        try:
            response = openai.ChatCompletion.create(
                engine=deployment,
                messages=messages,
                max_tokens=800,
                temperature=0.7,
                top_p=0.95,
                frequency_penalty=0,
                presence_penalty=0
            )
            return response['choices'][0]['message']['content'].strip()
        except Exception as e:
            logger.error(f"Failed to call Azure OpenAI API: {e}")
            raise

    def post(self, request):
        user_input = request.data.get('text', '')
        print('call is here')
        if not user_input:
            return Response({"error": "No input text provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Rephrase the user input
        try:
            prompt = f"Create a well-structured prompt to help design an app based on the following idea: {user_input}. Please rephrase it to be more suitable for a common man to understand what you think of his requirement and how you are going to design the solution it should include the screens you might give, what kind of actions can be done on the app and what are the features of the app that you can use it for. Your response should only start with 'I want to create...'"

            messages = [
                {"role": "system", "content": "You are an AI assistant who helps people to ideate and better rephrase their app ideas, which can be send to open ai to create the backend for the mobile app that the user wants to create. Your response will start directly with the content and nothing else, no preamble no start up statements etc, response should start with 'I want to create...' "},
                {"role": "user", "content": prompt}
            ]
            
            response = self.call_azure_openapi(messages)
            print(f'the response receied is {response}')

            return Response({"rephrased_text": response}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)