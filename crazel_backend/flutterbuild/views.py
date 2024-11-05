import os
import subprocess
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai
import logging
from dotenv import load_dotenv
from rest_framework.response import Response
from rest_framework import status
import re

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Set the OpenAI API key and other credentials
endpoint = os.getenv("ENDPOINT_URL", "https://husky-m2813bok-westeurope.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-35-turbo")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "REPLACE_WITH_YOUR_KEY_VALUE_HERE")
github_token = os.getenv("GITHUB_TOKEN", "REPLACE_WITH_YOUR_GITHUB_TOKEN")
openai.api_key = subscription_key

# Base directory where generated Flutter projects will be stored
BASE_FLUTTER_PROJECT_DIR = '../flutter_serivce/workspace/'

def call_azure_openapi(messages):
    """
    Call Azure OpenAI API to generate the Flutter app code.
    """
    try:
        # Set your Azure OpenAI API key and endpoint
        openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")  # Ensure this is set correctly
        openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")  # Set your Azure endpoint
        openai.api_type = "azure"
        openai.api_version = "2024-10-01-preview"

        # Log the calling function


        # Make the OpenAI API call using chat_completions
        response = openai.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_ID"),  # Chat model deployed in Azure
            messages=messages,
            max_tokens=4000,
            temperature=0.7
        )

        # Extract the response text
        return response.choices[0].message.content


    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        raise e

def get_user_intent(chat_history):
    messages = [
                {"role": "system", "content": "You are an intelligent AI assistant who can extarct intent from a user input and format it in a well strcutured manner"},
                {"role": "user", "content": str(chat_history)}
            ]
    
    response = call_azure_openapi(messages)
    print('the user intent is {response}')
    return response


def create_prompt(app_name, chat_history):
    """
    Create a detailed prompt based on user requirements.
    """
    user_requirements = []
    for entry in chat_history:
        if isinstance(entry, dict):
            question = entry.get('question')
            answer = entry.get('answer')
            if question and answer:
                user_requirements.append(f"{question}: {answer}")
    
    complete_prompt = f"""
        Generate a Flutter app with  `main.dart` and `pubspec.yaml` with the following structure and user requirements:

        1. **App Name**: {app_name}
        2. **Primary Features**:
            {get_user_intent(chat_history)}

        3. **UI Requirements**:
            - The UI should be visually stunning, with a clean, gradient background and modern layout.
            - Include a simple, elegant AppBar with the title '{app_name}'.
            - Use appealing fonts and interactive elements (sliders, checkboxes, and toggles).
            - Include fluid transitions between screens to ensure a smooth user experience.
            - Make sure buttons are well-designed with rounded corners and animations.
        
        4. **Navigation**:
            - Use Flutter’s navigation for multiple pages (e.g., Home Screen, Reminders, Articles etc).
            - Ensure transitions between screens are smooth and immersive.

        5. **Interaction**:
            - Enable users to interact through touch gestures.
            - Include buttons, menus, sliders, and toggles for easy interactions.

        6. **State Management**:
            - Implement simple state management (e.g., using `setState` or a state management library like `Provider`).

        7. **No Login Required**:
            - Do not include login or authentication features.

        8. **Output Requirements**:
            - Provide complete and valid Dart code for the Flutter project.
            - Ensure compatibility with the latest Flutter SDK.
    """
    print('############################')
    print('############################')
    print(f'the complete prompt is {complete_prompt}')
    print('############################')
    print('############################')
    return complete_prompt

def extract_code_blocks(response):
    """
    Extracts the code blocks for different files (main.dart, pubspec.yaml, etc.)
    from the OpenAI response.
    """
    files = {}

    # Regular expressions to find sections
    main_dart_match = re.search(r"```dart\n([\s\S]*?)```", response)
    if not main_dart_match:
        main_dart_match = re.search(r"\*\*main\.dart\*\*\n```dart\n([\s\S]*?)```", response)
    pubspec_match = re.search(r"```yaml\n([\s\S]*?)```", response)
    if not pubspec_match:
            pubspec_match = re.search(r"\*\*pubspec\.yaml\*\*\n```yaml\n([\s\S]*?)```", response)


    # Check and store code blocks
    if main_dart_match:
        files['main.dart'] = main_dart_match.group(1)
    else:
        raise ValueError("No valid `main.dart` block found in the response.")

    if pubspec_match:
        files['pubspec.yaml'] = pubspec_match.group(1)
    else:
        raise ValueError("No valid `pubspec.yaml` block found in the response.")

    if not files:
        raise ValueError("No valid code blocks found in the Dart code.")

    return files

# Helper function to create a Flutter project structure
def create_flutter_project(app_name, dart_code):
    
    print(f'the app_name response is {app_name}')
    if not app_name or not isinstance(app_name, str):
        raise ValueError("App name is required and must be a valid string.")
    
    project_dir = os.path.join(BASE_FLUTTER_PROJECT_DIR, app_name)
    print(f'the project_dir response is {project_dir}')
    if not project_dir:
        raise ValueError("Failed to create the Flutter project directory.")

    # Ensure the base directory exists
    os.makedirs(project_dir, exist_ok=True)
    
    files = extract_code_blocks(dart_code)
    if not files:
        raise ValueError("No valid code blocks found in the Dart code.")

    # Ensure lib folder exists
    os.makedirs(os.path.join(project_dir, 'lib'), exist_ok=True)

    # Save main.dart
    if 'main.dart' in files:
        with open(os.path.join(project_dir, 'lib', 'main.dart'), 'w') as f:
            f.write(files['main.dart'])

    # Save pubspec.yaml
    if 'pubspec.yaml' in files:
        with open(os.path.join(project_dir, 'pubspec.yaml'), 'w') as f:
            f.write(files['pubspec.yaml'])

    flutter_path = f'generate_flutter_project/{app_name}'
    return flutter_path



def find_flutter():
    # Get the system PATH variable
    paths = os.getenv('PATH').split(os.pathsep)
    
    # Check each directory in the PATH for the flutter executable
    for path in paths:
        flutter_path = os.path.join(path, 'flutter')
        # Check if the flutter executable exists in this directory
        if os.path.isfile(flutter_path):
            return flutter_path+'.bat'

    return None


def build_flutter_code(app_name, messages):
    """
    Build the core flutter files for the web
    """
    response_data = call_azure_openapi(messages)

    print(f'the openai response is {response_data}')
    
    # Create Flutter project with the generated Dart code
    project_dir = create_flutter_project(app_name, response_data)
    print(f'sucess toll herererjasdjsaod ha as i have twna0s tere are thuingsasa re {project_dir}')

    # Build the Flutter project for the web
    # try:
    #     flutter_bin_path = find_flutter()
    #     project_dir = os.getcwd()
    #     print(f'the project_dir is {project_dir}')

    #     # Attempt to build the Flutter project for the web
    #     build_result = subprocess.run([flutter_bin_path, 'build', 'web'], cwd=project_dir, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


    #     print(f"Flutter build output: {build_result.stdout.decode('utf-8')}")
    #     print(f"Flutter build errors (if any): {build_result.stderr.decode('utf-8')}")

    # except subprocess.CalledProcessError as e:
    #     # Log error details and return a response indicating the build failure
    #     error_message = f"Flutter build failed with error: {e.stderr.decode('utf-8')}"
    #     print(error_message)
    #     raise RuntimeError(error_message)
    # except Exception as e:
    #     # Catch any other exceptions that might occur
    #     logger.error(f"Unexpected error during Flutter build: {str(e)}")
    #     raise

    # Serve the web build directory (Assumes your server is configured to serve this directory)
    # web_dir = os.path.join(project_dir, 'build', 'web')
    # if not os.path.exists(web_dir):
    #     raise ValueError(f"Failed to build the Flutter project. Directory not found: {web_dir}")
    
    # web_url = f"/{web_dir}"  # Assuming the web server is configured to serve this directory
    # return web_url
    
    
# Django view to handle Flutter app generation
@csrf_exempt
def generate_flutter_project(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            app_name = data.get('appName')
            chat_history = data.get('chatHistory')

            if not chat_history:
                logger.warning('No chat history provided in the request.')
                return Response({"error": "No chat history provided."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Prepare system message and prompt
            with open('fluttersystemmessage.txt', 'r') as file:
                chatbot_system_message = file.read()

            prompt = create_prompt(app_name, chat_history)
            messages = [
                {"role": "system", "content": chatbot_system_message},
                {"role": "user", "content": prompt}
            ]

            # Call Azure OpenAI API to generate Dart code
            web_url = build_flutter_code(app_name, messages)

            return JsonResponse({"status": "success", "web_url": web_url})

        except Exception as e:
            logger.error(f"Error generating Flutter project: {str(e)}")
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
