import os
import subprocess
import openai
import re

from flask import Blueprint, request, jsonify
import logging
from dotenv import load_dotenv
import inspect
import shutil

# Load environment variables
load_dotenv()

main = Blueprint('main', __name__)
logger = logging.getLogger(__name__)

# Azure OpenAI Configuration
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")  # Correct Azure API base
openai.api_type = "azure"
openai.api_version = "2024-10-01-preview"

BASE_FLUTTER_PROJECT_DIR = '/flutter_service/workspace/'

log_file = "/var/log/flask.out.log"
# log_file = "flask.out.log"
logging.basicConfig(
    filename=log_file,
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger(__name__)

def log_message(message):
    """Helper function to log messages."""
    logger.debug(message)

def call_azure_openapi(messages):
    """
    Call Azure OpenAI API using the chat_completions endpoint to generate the Flutter app code.
    """
    try:
        # Set your Azure OpenAI API key and endpoint
        openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")  # Ensure this is set correctly
        openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")  # Set your Azure endpoint
        openai.api_type = "azure"
        openai.api_version = "2024-10-01-preview"

        # Log the calling function
        calling_function = inspect.stack()[1].function
        log_message(f"Calling OpenAI API with messages: {messages}")


        # Make the OpenAI API call using chat_completions
        response = openai.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_ID"),  # Chat model deployed in Azure
            messages=messages,
            max_tokens=4000,
            temperature=0.7
        )

        # Extract the response text
        data_received = response.choices[0].message.content
        log_message(f"Received data: {data_received}")
        return response.choices[0].message.content


    except Exception as e:
        print(f"Error in OpenAI API call: {e}")
        raise e


def get_user_intent(chat_history):
    """
    Converts chat history to a formatted string and uses OpenAI to extract user intent using ChatCompletion API.

    """
    log_message(f"Extracting user intent from chat history: {chat_history}")

    if isinstance(chat_history, list):
        # Convert chat_history to a single string, joining each entry by a newline
        formatted_chat_history = "\n".join([str(item) for item in chat_history])
    else:
        # Ensure it's a string if chat_history isn't a list
        formatted_chat_history = str(chat_history)

    # Prepare the messages for the ChatCompletion API
    messages = [
        {"role": "system", "content": "You are an intelligent AI assistant who can extract intent from a user's input and format it in a well-structured manner."},
        {"role": "user", "content": f"Here is the chat history:\n{formatted_chat_history}"}
    ]
    
    # Call OpenAI and return the intent using messages
    return call_azure_openapi(messages)



def create_prompt(app_name, chat_history):
    """
    Create a structured prompt based on the app name and chat history.
    """
    user_requirements = get_user_intent(chat_history)
    
    # Construct the prompt to guide the Flutter app generation
    prompt = f"""
    Generate a complete `main.dart` and `pubspec.yaml` files for a flutter app, based on the following detailed requirements:

            ### App Information
            1. **App Name**: {app_name}

            ### Functional Requirements
            2. **Primary Features**:
            - {user_requirements}

            ### UI and Design Requirements
            3. **UI Design**:
            - A visually stunning and modern interface with a gradient background.
            - An elegant AppBar with the title '{app_name}'.
            - Use appealing, high-quality fonts and design interactive elements like sliders, checkboxes, and toggles.
            - Include fluid animations and transitions to enhance the user experience.
            - Well-designed, modern buttons with rounded corners and hover/tap animations.

            ### Navigation and Interaction
            4. **Navigation**:
            - Implement Flutter’s built-in navigation to support multiple pages, such as a Home Screen, Reminders Screen, Articles Screen, etc.
            - Ensure smooth and immersive transitions between screens.

            5. **User Interaction**:
            - Allow for touch-based interactions with buttons, menus, sliders, and toggles.
            - Optimize the app for a responsive experience on both portrait and landscape orientations.

            ### State Management
            6. **State Management**:
            - Use simple state management techniques like `setState` for maintaining and updating the app's state.
            - If needed, suggest using `Provider` for more complex interactions.

            ### Additional Requirements
            7. **No Login Required**:
            - Do not implement login or authentication features.

            ### Output Format
            8. **Code Requirements**:
            - Provide complete, valid, and well-documented Dart code for `main.dart`.
            - Include a fully compatible `pubspec.yaml` file with all necessary dependencies, like `google_fonts` for custom fonts.
            - Ensure the code works seamlessly with the latest Flutter SDK version.

            Make sure to include comments in the code to explain the key sections and to follow Flutter best practices for a high-quality, maintainable app.

    """
    log_message(f"THe full prompt sent is : {prompt}")
    return prompt


def extract_code_blocks(response):
    """
    Extracts Dart and YAML code blocks from the OpenAI response.
    """
    files = {}
    log_message(f"Extracting code blocks from response.")


    # Find Dart code
    main_dart_match = re.search(r"```dart\n([\s\S]*?)```", response)
    log_message(f"Extracting code blocks from response.")

    # Find YAML code (pubspec.yaml)
    pubspec_match = re.search(r"```yaml\n([\s\S]*?)```", response)
    log_message(f"Extracting code blocks from response.")


    if main_dart_match:
        files['main.dart'] = main_dart_match.group(1)
    else:
        raise ValueError("No valid `main.dart` block found.")

    if pubspec_match:
        files['pubspec.yaml'] = pubspec_match.group(1)
    else:
        raise ValueError("No valid `pubspec.yaml` block found.")

    return files


def create_flutter_project(app_name, dart_code):
    """
    Creates a Flutter project with the generated Dart code.
    """
    # Ensure the base directory exists, and create it if it doesn't
    os.makedirs(BASE_FLUTTER_PROJECT_DIR, exist_ok=True)

    # Create project directory
    project_dir = os.path.join(BASE_FLUTTER_PROJECT_DIR, app_name)
    os.makedirs(project_dir, exist_ok=True)  # Ensure the project directory is created

    # Extract the main.dart and pubspec.yaml from the response
    files = extract_code_blocks(dart_code)
    log_message(f"THe extracted  files sent is : {files}")
    
    lib_dir = os.path.join(project_dir, 'lib')
    os.makedirs(lib_dir, exist_ok=True)  # Ensure the lib directory is created

    # Save main.dart
    if 'main.dart' in files:
        with open(os.path.join(lib_dir, 'main.dart'), 'w') as f:
            f.write(files['main.dart'])

    # Save pubspec.yaml
    if 'pubspec.yaml' in files:
        with open(os.path.join(project_dir, 'pubspec.yaml'), 'w') as f:
            f.write(files['pubspec.yaml'])

    print(f"Flutter project generated at: {project_dir}")
    return project_dir  # Return the actual directory path



def build_flutter_code(app_name, messages):
    """
    Builds the Flutter web project from the generated code.
    """
    response_data = call_azure_openapi(messages)

    # Create the Flutter project using the response
    project_dir = create_flutter_project(app_name, response_data)

    # Build the Flutter web project
    try:

        subprocess.run(["flutter", "clean"], cwd=project_dir, check=True)
        subprocess.run(["flutter", "pub", "get"], cwd=project_dir, check=True)
        
        # Ensure the 'web' directory exists
        web_dir = os.path.join(project_dir, 'web')
        os.makedirs(web_dir, exist_ok=True)

        # Check if index.html is present; if not, create it
        index_html = os.path.join(web_dir, 'index.html')
        if not os.path.exists(index_html):
            with open(index_html, 'w') as f:
                f.write("""
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <title>Flutter Web App</title>
                </head>
                <body>
                  <script src="main.dart.js" type="application/javascript"></script>
                </body>
                </html>
                """)

        # Clean previous builds
        subprocess.run(["flutter", "clean"], cwd=project_dir, check=True)

        # Build the Flutter web project
        result = subprocess.run(
            ["flutter", "build", "web"],
            cwd=project_dir,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Capture and log the stdout and stderr
        log_message(f"Flutter build output: {result.stdout.decode('utf-8')}")
        log_message(f"Flutter build errors: {result.stderr.decode('utf-8')}")

        # Define Nginx directory for serving web app
        nginx_web_path = f"/usr/share/nginx/html/{app_name}/web"
        os.makedirs(nginx_web_path, exist_ok=True)

        # Copy the build output to Nginx's serving directory
        web_build_path = os.path.join(project_dir, 'build', 'web')
        shutil.copytree(web_build_path, nginx_web_path, dirs_exist_ok=True)

        return f"/{app_name}/web"  # Return relative path for Nginx to serve

        
        
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Flutter build failed: {e}")
