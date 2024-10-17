from channels.generic.websocket import AsyncWebsocketConsumer
import json

class BuildStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.app_name = self.scope['url_route']['kwargs']['app_name']
        self.group_name = f'build_status_{self.app_name}'

        # Join group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from group
    async def build_status(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
