
# accounts/views.py
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.csrf import csrf_protect

# Register view
@csrf_protect
def register_view(request):
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirm_password = request.POST['confirm_password']
        
        if password != confirm_password:
            messages.error(request, "Passwords do not match!")
        else:
            if User.objects.filter(username=username).exists():
                messages.error(request, "Username already exists!")
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                messages.success(request, "Registration successful! Please login.")
                return redirect('login')  # Redirect to login page after successful registration
    return render(request, 'register.html')


# Login view
@csrf_protect
def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('main')  # Redirect to main page after successful login
        else:
            messages.error(request, "Invalid username or password!")
    return render(request, 'login.html')

def logout_view(request):
    logout(request)
    return redirect('login')



@login_required
def main_view(request):
    return render(request, 'main.html')

@login_required
def home_view(request):
    return redirect('main') # Redirect to login page


@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html') # Redirect to login page


@login_required
def weather_view(request):
    return render(request, 'weather.html')