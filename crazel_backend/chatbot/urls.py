from django.urls import path
from .views import BuildAppAPIView
from . import views

urlpatterns = [
    path('build/', BuildAppAPIView.as_view(), name='build_app'),
    path('get-main-dart/<str:appname>/', views.get_main_dart, name='get_main_dart'),
    path('get-pubspec-yaml/<str:appname>/', views.get_pubspec_yaml, name='get_pubspec_yaml'),

]