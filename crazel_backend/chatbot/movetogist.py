import requests
import json

def upload_dart_file_to_gist(file_name, dart_code, access_token):
    """
    Uploads a Dart file as a public GitHub Gist.
    
    :param file_name: Name of the Dart file (e.g., 'main.dart')
    :param dart_code: Dart code content as a string
    :param access_token: GitHub personal access token for authentication
    :return: URL of the created Gist
    """
    # API endpoint for creating a Gist
    url = "https://api.github.com/gists"
    
    # Gist file content in JSON format
    payload = {
        "description": "Dart code uploaded via Python script",
        "public": True,  # Public Gist
        "files": {
            file_name: {
                "content": dart_code
            }
        }
    }
    
    # GitHub token for authentication
    headers = {
        "Authorization": f"token {access_token}",
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

# Example usage
if __name__ == "__main__":
    # Dart code content
    dart_code = """
void main() {
  print('Hello, Dart World!');
}
"""

    # GitHub personal access token (replace with your own)
    access_token = "your_personal_access_token_here"
    
    # Upload the Dart file as a Gist
    gist_url = upload_dart_file_to_gist("main.dart", dart_code, access_token)
    
    # If the Gist is created, print the URL
    if gist_url:
        print(f"View your Gist at: {gist_url}")
