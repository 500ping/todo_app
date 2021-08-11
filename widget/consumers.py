import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth.models import User

class WidgetConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 1
        self.room_group_name = 'widget_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_widget_information()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def send_widget_information(self, event={}):
        self.user_count = await self.count_all_user()

        await self.send(text_data=json.dumps({
            'widget': {
                'user_count': self.user_count
            }
        }))

    @database_sync_to_async
    def count_all_user(self):
        return User.objects.all().count()