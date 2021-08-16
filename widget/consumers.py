import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth.models import User
from django.db.models import Sum

from tobuy.models import MustBuy


class WidgetConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # get current user
        self.user = self.scope["user"]

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
        user_count = await self.count_all_user()
        sum_tobuy = await self.get_sum_tobuy()

        await self.send(text_data=json.dumps({
            'widget': {
                'user_count': user_count,
                'sum_tobuy': sum_tobuy['price__sum'],
            }
        }))

    @database_sync_to_async
    def count_all_user(self):
        return User.objects.all().count()

    @database_sync_to_async
    def get_sum_tobuy(self):
        return MustBuy.objects.filter(user=self.user, status=False).aggregate(Sum('price'))

