from flask import Flask, request, jsonify
from llm_model.model import generate_response

app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    if 'text' not in data:
        return jsonify({'error': 'Text is required'}), 400

    user_text = data['text']
    response = generate_response(user_text)

    return jsonify({'response': response})

import os
import requests
from flask import Flask, request, jsonify
from github import Github

app = Flask(__name__)

# Set up your GitHub access token
GITHUB_ACCESS_TOKEN = os.getenv("GITHUB_ACCESS_TOKEN")

# Function to update Gist
def update_gist(gist_id, new_content):
    g = Github(GITHUB_ACCESS_TOKEN)
    gist = g.get_gist(gist_id)
    gist.edit(files={'main.dart': {"content": new_content}})

@app.route('/api/update-dart', methods=['POST'])
def update_dart():
    data = request.json
    app_name = data.get('app_name')
    changes = data.get('changes')
    gist_url = data.get('gist_url')

    if not app_name or not changes or not gist_url:
        return jsonify({"error": "app_name, changes, and gist_url are required"}), 400

    gist_id = gist_url.split('/')[-1]  # Extract Gist ID from URL

    # Load the current main.dart file
    dart_file_path = f'generate_apps/{app_name}/{app_name}_main.dart'

    try:
        with open(dart_file_path, 'r') as file:
            dart_content = file.read()
        
        # Apply changes (you can create a more complex logic here)
        updated_content = dart_content + "\n" + changes  # Append changes for simplicity

        # Write the updated file back
        with open(dart_file_path, 'w') as file:
            file.write(updated_content)

        # Update Gist
        update_gist(gist_id, updated_content)

        return jsonify({"message": "Dart code updated and pushed to Gist", "gist_url": gist_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

# Load your LLM model (distilGPT2 or similar lightweight model)
generator = pipeline('text-generation', model='distilgpt2')

@app.route('/api/llm/suggest-change', methods=['POST'])
def suggest_change():
    data = request.json
    suggestion = data.get('suggestion')
    dart_code = data.get('dartCode')

    if not suggestion or not dart_code:
        return jsonify({"error": "Invalid input"}), 400

    # Use the LLM to suggest changes based on the user input
    input_text = f"Make the following changes to the app: {suggestion}\nCurrent Dart code:\n{dart_code}"
    suggestions = generator(input_text, max_length=512)

    # Return the suggestions
    return jsonify({"suggestedChanges": suggestions[0]['generated_text']}), 200



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
