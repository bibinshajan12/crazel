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
        logger.info('Received POST request to build app.')
        chat_history = request.data.get('chatHistory')
        if not chat_history:
            logger.warning('No chat history provided in the request.')
            return Response({"error": "No chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Generate a prompt based on the chat history
            prompt = self.create_prompt(chat_history)
            if not prompt:
                logger.error('Failed to create a prompt from the chat history.')
                return Response({"error": "Invalid chat history provided."}, status=status.HTTP_400_BAD_REQUEST)

            # Prepare messages for the Azure OpenAI API
            messages = [
                {"role": "system", "content": "You are an AI assistant that helps people find information."},
                {"role": "user", "content": prompt}
            ]

            # Generate the Flutter app code using Azure OpenAI
            app_files = self.call_azure_openapi(messages)

            # Save the generated app files
            output_dir = os.path.join(settings.BASE_DIR, 'generated_apps', 'new_app')
            if os.path.exists(output_dir):
                shutil.rmtree(output_dir)
            os.makedirs(output_dir, exist_ok=True)

            # Write the main.dart file
            with open(os.path.join(output_dir, 'main.dart'), 'w') as f:
                f.write(app_files)  # Assuming the response includes main.dart code

            # Write the pubspec.yaml file
            with open(os.path.join(output_dir, 'pubspec.yaml'), 'w') as f:
                f.write('name: new_app\ndescription: Generated Flutter app')

            logger.info('App has been generated successfully.')
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
            return (
                f"I need your help to create a Flutter mobile app with the following specifications: {requirements_text}. "
                "Please provide the complete app's code in a single main.dart file and a pubspec.yaml file. The focus should be on delivering a beautiful and modern UI. The code should be well-organized and result in a fully functional mobile app. Thank you!"
            )
        else:
            logger.warning('Chat history does not contain valid user requirements.')
            return None