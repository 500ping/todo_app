from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def send_widget_information():
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'widget_1',
        {
            'type': 'send_widget_information',
        }
    ) 