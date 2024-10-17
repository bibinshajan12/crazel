import os
import json
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

# Function to read the existing Flutter project files
def get_flutter_project_path(app_name):
    # Path where main.dart and pubspec.yaml are already generated
    return os.path.join('generate_apps', app_name)

# View to serve the content of main.dart for DartPad preview
@csrf_exempt
def start_build(request):
    if request.method == "POST":
        try:
            # Parse the incoming JSON data
            data = json.loads(request.body)
            
            app_name = data.get('appName')  # Extract 'appName' from the request data
            print(f'the app name is {app_name} ')
            
            if not app_name:
                return JsonResponse({'status': 'error', 'message': 'App name is missing'}, status=400)

            # Get Flutter project path
            project_path = get_flutter_project_path(app_name)

            # Check if the main.dart file exists
            main_dart_path = os.path.join(project_path, 'lib', 'main.dart')

            if not os.path.exists(main_dart_path):
                return JsonResponse({'status': 'error', 'message': 'main.dart file not found'}, status=404)

            # Read the main.dart content
            with open(main_dart_path, 'r') as file:
                main_dart_content = file.read()
                print(f'the content is {main_dart_content}')

            # Return the content of main.dart for DartPad
            return JsonResponse({
                'status': 'success',
                'mainDartContent': main_dart_content,
                'message': f'main.dart file for {app_name} loaded successfully.'
            }, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON data'}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


# Serve the app preview in DartPad (not required now, will be handled by React)
def serve_app_preview(request, app_name):
    # This view is not needed anymore since the preview is handled by DartPad in the frontend.
    return JsonResponse({
        'status': 'error',
        'message': 'Preview is served directly via DartPad'
    }, status=400)



