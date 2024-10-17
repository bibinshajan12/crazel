

from django.urls import path
from . import views

urlpatterns = [
    # Route to trigger the build process
    path('start-build/', views.start_build, name='start_build'),
    
    
    # Route to serve the generated app preview (index.html)
    path('serveapp/<str:app_name>', views.serve_app_preview, name='serve_app_preview'),
]
