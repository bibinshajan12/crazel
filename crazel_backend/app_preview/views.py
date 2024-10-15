import os
import subprocess
import requests
import zipfile
import shutil
import logging
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

FLUTTER_INSTALL_PATH = "/usr/local/flutter"  # Adjust this as per your server

def serve_flutter_app(request, appname):
    logging.info(f"Serving Flutter app for app: {appname}")
    # Path to the Flutter web build directory
    flutter_build_dir = f'generate_apps/{appname}/build/web'
    index_file = os.path.join(flutter_build_dir, 'index.html')

    # Check if index.html exists and serve it
    if os.path.exists(index_file):
        logging.info(f"Flutter app found for app: {appname}, serving index.html")
        with open(index_file, 'r') as file:
            response = HttpResponse(file.read(), content_type="text/html")
            # Set the X-Frame-Options to allow embedding
            response['X-Frame-Options'] = 'ALLOWALL'
            return response
    else:
        logging.error(f"Flutter app not found for app: {appname}")
        return HttpResponse("Flutter app not found. Please build the Flutter app first.", status=404)

def install_flutter():
    try:
        logging.info("Starting Flutter installation.")
        # Download Flutter SDK
        flutter_url = "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.3.0-stable.zip"  # Update this URL with the latest stable version
        response = requests.get(flutter_url, stream=True)
        flutter_zip_path = "/tmp/flutter_sdk.zip"

        # Save zip file to a temporary location
        with open(flutter_zip_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)
        logging.info("Flutter SDK downloaded successfully.")

        # Extract Flutter SDK
        with zipfile.ZipFile(flutter_zip_path, "r") as zip_ref:
            zip_ref.extractall("/usr/local")
        logging.info("Flutter SDK extracted successfully.")

        # Move the flutter folder to the desired path
        if os.path.exists(FLUTTER_INSTALL_PATH):
            shutil.rmtree(FLUTTER_INSTALL_PATH)  # Remove existing if necessary
        shutil.move("/usr/local/flutter", FLUTTER_INSTALL_PATH)
        logging.info("Flutter SDK moved to the install path successfully.")

        # Clean up the zip file
        os.remove(flutter_zip_path)
        logging.info("Flutter SDK zip file cleaned up.")

        # Add Flutter to PATH environment variable dynamically
        os.environ["PATH"] += os.pathsep + os.path.join(FLUTTER_INSTALL_PATH, "bin")
        logging.info("Flutter installation completed successfully.")

        return True, "Flutter installed successfully"
    except Exception as e:
        logging.error(f"Error during Flutter installation: {str(e)}")
        return False, str(e)

def app_preview(request, appname):
    logging.info(f"Starting app preview build for app: {appname}")
    # Path to the generated Flutter app directory
    app_dir = f'generate_apps/{appname}'

    # Ensure the Flutter project directory exists
    if not os.path.exists(app_dir):
        logging.error(f"Application directory does not exist for app: {appname}")
        return JsonResponse({'error': 'Application does not exist'}, status=404)

    try:
        # Check if Flutter is installed by running `flutter --version`
        try:
            subprocess.run(["flutter", "--version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            logging.info("Flutter is already installed.")
        except subprocess.CalledProcessError:
            # Flutter not installed, proceed to install it
            success, message = install_flutter()
            if not success:
                logging.error(f"Flutter installation failed: {message}")
                return JsonResponse({'error': message}, status=500)

        # Run the Flutter build command for web in the specified directory
        result = subprocess.run(
            ['flutter', 'build', 'web'],
            cwd=app_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        # Log stdout and stderr for better diagnosis
        stdout_log = result.stdout.decode()
        stderr_log = result.stderr.decode()
        logging.info(f"Flutter build stdout: {stdout_log}")
        if result.returncode != 0:
            logging.error(f"Flutter build failed with stderr: {stderr_log}")
            return JsonResponse({'error': stderr_log}, status=500)

        logging.info(f"Flutter app built successfully for app: {appname}")

        # Ensure the `index.html` exists after the build
        index_file = os.path.join(app_dir, 'build/web/index.html')
        if not os.path.exists(index_file):
            logging.error(f"Error: index.html is missing after the Flutter build for app: {appname}")
            return JsonResponse({'error': 'Flutter build completed, but index.html is missing.'}, status=500)

        return JsonResponse({'message': 'Flutter app built successfully'})
    except subprocess.CalledProcessError as e:
        logging.error(f"Error during Flutter build for app {appname}: {e.stderr.decode()}")
        return JsonResponse({'error': e.stderr.decode()}, status=500)
