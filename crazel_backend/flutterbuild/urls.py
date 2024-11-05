from django.urls import path
from . import views  # Import your views file

urlpatterns = [
    # Other routes...
    path('create/', views.generate_flutter_project, name='generate_flutter_project'),  # New endpoint
]
