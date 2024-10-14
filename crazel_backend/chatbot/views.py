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


# Set up logging
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
endpoint = os.getenv("ENDPOINT_URL", "https://husky-m2813bok-westeurope.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-35-turbo")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "REPLACE_WITH_YOUR_KEY_VALUE_HERE")

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
        print('Received POST request to build app.')
        chat_history = request.data.get('chatHistory')
        appname = request.data.get('appName')
        print(f'the app name is {appname}')
        if not chat_history:
            logger.warning('No chat history provided in the request.')
            return Response({"error": "No chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate a prompt based on the chat history
            prompt = self.create_prompt(chat_history)
            print(f'the full prompt is {prompt}')
            if not prompt:
                logger.error('Failed to create a prompt from the chat history.')
                return Response({"error": "Invalid chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare messages for the Azure OpenAI API
            messages = [
                {"role": "system", "content": "You are an AI assistant that helps people find information."},
                {"role": "user", "content": prompt}
            ]

            # Generate the Flutter app code using Azure OpenAI
            app_files = None
            app_files = self.call_azure_openapi(messages)
            print(f'the response received from openai is {app_files}')
            create_flutter_files(app_files, appname)
            

            print('App has been generated successfully.')
            return Response({"success": True, "message": "App has been generated successfully."}, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"Configuration error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.exception('An error occurred while building the app.')
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create_prompt(self, chat_history):
        """Create a detailed prompt based on user requirements."""
        user_requirements = []
        for entry in chat_history:
            if isinstance(entry, dict):
                question = entry.get('question')
                answer = entry.get('answer')
                if question and answer:
                    user_requirements.append(f"{question}: {answer}")
        if user_requirements:
            requirements_text = '\n'.join(user_requirements)
            with open('prompt_body.txt', 'r') as file:
                prompt_body = file.read()

            # Combine the user inputs (requirements_text) with the prompt body
            complete_prompt = f"""
            I need your help to generate a complete Flutter mobile app based on the following user inputs:

            {requirements_text}

            {prompt_body}
            """
            
            return complete_prompt
        else:
            logger.warning('Chat history does not contain valid user requirements.')
            return None
    

# Function to parse and write each section to its respective file


# Function to parse and write main.dart and pubspec.yaml files
def create_flutter_files(response, appname):
    base_dir = f'generate_apps/{appname}/lib'
    
    # Ensure base directory exists for main.dart
    os.makedirs(base_dir, exist_ok=True)

    # Extract main.dart content from the response
    main_dart_content = None

    # Split the response into sections based on the template
    if '```dart' in response:
        sections = response.split('```dart')  # Separate based on code block with dart
    else:
        sections = response.split('```')  # Separate based on generic code block


    # Extract main.dart content
    if len(sections) >= 2:
        main_dart_content = sections[1].strip().rstrip('```').strip()  # Extract content between code block markers

    # Ensure required content is found
    if not main_dart_content:
        print("Required content for main.dart not found in the response.")
        return

    # Write main.dart content to file
    main_dart_path = os.path.join(base_dir, 'main.dart')
    with open(main_dart_path, 'w') as file:
        file.write(main_dart_content)
    print(f"main.dart file created at {main_dart_path}")

    # Validate and clean the Dart file
    validate_dart_file(main_dart_path)
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

    # Default dependencies
    dependencies_list = ['flutter']
    dependencies_list.extend(dependencies)

    # Create pubspec.yaml content dynamically
    pubspec_header = """
name: {}
description: A new Flutter project.
version: 1.0.0+1
environment:
  sdk: ">=2.17.0 <3.0.0"

dependencies:
""".format(appname)
    pubspec_dependencies = generate_dependencies_content(dependencies_list)
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

def generate_dependencies_content(dependencies_list):
    pubspec_dependencies = ""
    for dependency in dependencies_list:
        if dependency == 'flutter':
            pubspec_dependencies += "  flutter:\n    sdk: flutter\n"
        else:
            pubspec_dependencies += "  {}: any\n".format(dependency)
    return pubspec_dependencies

def merge_pubspec_content(header, dependencies, footer):
    return "{}{}{}".format(header, dependencies, footer)

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

