

from django.urls import path
from . import views

urlpatterns = [
    # Route to trigger the build process
    path('start-build/', views.start_build, name='start_build'),
    path('suggest-change/', views.suggest_change, name='suggest_change'),
    path('update-gist/', views.update_gist_view, name='update_gist_view'),
    path('revalidate-code/', views.revalidate_code_view, name='revalidate_code_view'),
    
    
]
