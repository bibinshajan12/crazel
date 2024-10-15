from django.urls import path
from . import views

urlpatterns = [
    path('apppreviews/', views.app_preview, name='app_preview'),  # Define the app preview URL
    path('view/<str:appname>/', views.app_preview, name='app_preview'),
    path('serveflutterapp/<str:appname>/', views.serve_flutter_app, name='serve_flutter_app'),   
]
