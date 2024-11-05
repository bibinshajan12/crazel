from flask import Blueprint, request, jsonify
from flask_app.services.flutter_builder import create_flutter_project, build_flutter_code, create_prompt
import logging

main = Blueprint('main', __name__)
logger = logging.getLogger(__name__)

@main.route('/generate_flutter_web', methods=['POST'])
def generate_flutter_project():
    """
    Endpoint to generate Flutter project based on the user requirements.
    """
    try:
        data = request.get_json()
        app_name = data.get('appName')
        chat_history = data.get('chatHistory')

        if not chat_history:
            logger.warning('No chat history provided in the request.')
            return jsonify({"error": "No chat history provided."}), 400

        # Prepare the prompt and call the Flutter generation logic
        prompt = create_prompt(app_name, chat_history)
        with open('fluttersystemmessage.txt', 'r') as file:
                chatbot_system_message = file.read()
        messages = [
            {"role": "system", "content": chatbot_system_message},
            {"role": "user", "content": f"Generate a Flutter app called {app_name}."},
            {"role": "user", "content": prompt}
        ]

        # Call the service to generate the Flutter project
        web_url = build_flutter_code(app_name, messages)

        return jsonify({"status": "success", "web_url": web_url})

    except Exception as e:
        logger.error(f"Error generating Flutter project: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
