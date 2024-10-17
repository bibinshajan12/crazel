from django.urls import re_path
from .consumers import BuildStatusConsumer

websocket_urlpatterns = [
    re_path(r'ws/build_status/(?P<app_name>\w+)/$', BuildStatusConsumer.as_asgi()),
]
