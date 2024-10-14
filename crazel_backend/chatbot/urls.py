from django.urls import path
from .views import BuildAppAPIView

urlpatterns = [
    path('build/', BuildAppAPIView.as_view(), name='build_app'),
]