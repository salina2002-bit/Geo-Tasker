# accounts/urls.py
from django.urls import path
from .views import register_view, login_view, logout_view, main_view, home_view,dashboard_view,weather_view

urlpatterns = [
    path('', home_view, name='home'),  # Root URL
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('main/', main_view, name='main'),  # This route should work
    path('dashboard/' , dashboard_view , name = 'dashboard'),
    path('weather/' , weather_view , name = 'weather')
]
