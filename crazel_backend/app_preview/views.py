import os
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import openai
from dotenv import load_dotenv

load_dotenv()
endpoint = os.getenv("ENDPOINT_URL", "https://husky-m2813bok-westeurope.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-35-turbo")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY", "REPLACE_WITH_YOUR_KEY_VALUE_HERE")
github_token = os.getenv("GITHUB_TOKEN", "REPLACE_WITH_YOUR_GITHUB_TOKEN")

# Configure OpenAI API Key and GitHub Personal Access Token
openai.api_key = subscription_key

# Function to read the existing Flutter project files
def get_flutter_project_path(app_name):
    return os.path.join('generate_apps', app_name)

# Fetch the current Dart code from a Gist
def fetch_gist(gist_url):
    gist_id = gist_url.split('/')[-1]
    response = requests.get(f"https://api.github.com/gists/{gist_id}")
    return response.json()

# Update the Gist with new Dart code
def update_gist(gist_url, new_dart_code):
    gist_id = gist_url.split('/')[-1]
    payload = {
        "files": {
            "main.dart": {
                "content": new_dart_code
            }
        }
    }

    headers = {
        'Authorization': f'token {github_token}',
        'Accept': 'application/vnd.github.v3+json',
    }

    response = requests.patch(f"https://api.github.com/gists/{gist_id}", json=payload, headers=headers)
    return response.json()

# Function to call Azure OpenAI API
def call_azure_openapi(app_name, user_suggestion, current_dart_code):
    try:
        system_message = f"You are an expert in Flutter. You will be given a user's Dart code and their desired change. Provide only the updated Dart code, no explanation."
        user_prompt = f"Here is the current Dart code:\n{current_dart_code}\n\nMake the following change:\n{user_suggestion}"

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ]

        response = openai.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_ID"),  # Chat model deployed in Azure
            messages=messages,
            max_tokens=4000,
            temperature=0.7
        )


        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        raise Exception(f"Error calling OpenAI API: {e}")

# Revalidate function to handle errors and request code corrections from OpenAI
def revalidate_code(app_name, current_dart_code, errors):
    try:
        system_message = f"You are an expert in Flutter. You will be given a user's Dart code and errors in the code. Please fix the Dart code."
        user_prompt = f"Here is the current Dart code:\n{current_dart_code}\n\nHere are the errors:\n{errors}"

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_prompt}
        ]

        response = openai.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_ID"),  # Chat model deployed in Azure
            messages=messages,
            max_tokens=4000,
            temperature=0.7
        )


        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        raise Exception(f"Error revalidating Dart code via OpenAI: {e}")

# View to handle revalidating the Dart code using errors provided
@csrf_exempt
def revalidate_code_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            app_name = data.get('app_name')
            errors = data.get('errors')
            gist_url = data.get('gist_url')
            print(f'the data is app_name : {app_name} errors:{errors} gist_url:{gist_url}')

            # Fetch the current Dart code from the Gist
            gist_response = fetch_gist(gist_url)
            current_dart_code = gist_response.get('files', {}).get('main.dart', {}).get('content')

            if not current_dart_code:
                return JsonResponse({'error': 'Unable to fetch current Dart code from Gist'}, status=400)

            # Revalidate the code using OpenAI
            revalidated_code = revalidate_code(app_name, current_dart_code, errors)

            return JsonResponse({'revalidatedCode': revalidated_code}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Error revalidating code: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# View to handle the Gist update with the new Dart code
@csrf_exempt
def update_gist_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            gist_url = data.get('gist_url')
            new_dart_code = data.get('new_dart_code')

            # Update the Gist with the new Dart code
            updated_gist_response = update_gist(gist_url, new_dart_code)

            if updated_gist_response.get('html_url'):
                return JsonResponse({'gist_url': updated_gist_response.get('html_url')}, status=200)

            return JsonResponse({'error': 'Failed to update the Gist'}, status=400)

        except Exception as e:
            return JsonResponse({'error': f'Error updating Gist: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

# View to serve the content of main.dart for DartPad preview
@csrf_exempt
def start_build(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            app_name = data.get('appName')
            print(f'the app name is {app_name} ')

            if not app_name:
                return JsonResponse({'status': 'error', 'message': 'App name is missing'}, status=400)

            project_path = get_flutter_project_path(app_name)
            main_dart_path = os.path.join(project_path, 'lib', 'main.dart')

            if not os.path.exists(main_dart_path):
                return JsonResponse({'status': 'error', 'message': 'main.dart file not found'}, status=404)

            with open(main_dart_path, 'r') as file:
                main_dart_content = file.read()
                print(f'the content is {main_dart_content}')

            return JsonResponse({
                'status': 'success',
                'mainDartContent': main_dart_content,
                'message': f'main.dart file for {app_name} loaded successfully.'
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)

# View to handle suggestion input from the user and request OpenAI for changes
@csrf_exempt
def suggest_change(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            app_name = data.get('app_name')
            user_suggestion = data.get('changes')
            gist_url = data.get('gist_url')

            # Fetch the current Dart code from the Gist
            gist_response = fetch_gist(gist_url)
            current_dart_code = gist_response.get('files', {}).get('main.dart', {}).get('content')

            if not current_dart_code:
                return JsonResponse({'error': 'Unable to fetch current Dart code from Gist'}, status=400)

            # Call the OpenAI API with the current Dart code and user suggestion
            suggested_changes = call_azure_openapi(app_name, user_suggestion, current_dart_code)

            return JsonResponse({'suggestedChanges': suggested_changes}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Error processing suggestion: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)
