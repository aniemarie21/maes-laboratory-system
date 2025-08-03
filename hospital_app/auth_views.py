"""
Authentication views for MAES Hospital Management System
"""

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from django.urls import reverse
from .forms import PatientRegistrationForm, LoginForm
from .firebase_service import get_firebase_service
import uuid

def login_view(request):
    """Login view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            remember_me = form.cleaned_data['remember_me']
            
            # Try to authenticate with username or email
            user = authenticate(request, username=username, password=password)
            
            if user is None:
                # Try with email
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(request, username=user_obj.username, password=password)
                except User.DoesNotExist:
                    pass
            
            if user is not None:
                if user.is_active:
                    login(request, user)
                    
                    # Set session expiry
                    if not remember_me:
                        request.session.set_expiry(0)  # Session expires when browser closes
                    
                    messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
                    
                    # Redirect to appropriate dashboard
                    next_url = request.GET.get('next', 'dashboard')
                    return redirect(next_url)
                else:
                    messages.error(request, 'Your account is disabled. Please contact support.')
            else:
                messages.error(request, 'Invalid username/email or password.')
    else:
        form = LoginForm()
    
    context = {
        'form': form,
        'title': 'Login - MAES Hospital'
    }
    return render(request, 'hospital_app/auth/login.html', context)

def register_view(request):
    """Patient registration view"""
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = PatientRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Create Firebase user document
            firebase_service = get_firebase_service()
            firebase_data = {
                'user_id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'user_type': 'patient',
                'phone': form.cleaned_data['phone'],
                'date_of_birth': form.cleaned_data['date_of_birth'].isoformat(),
                'address': form.cleaned_data['address'],
                'emergency_contact': {
                    'name': form.cleaned_data['emergency_contact_name'],
                    'phone': form.cleaned_data['emergency_contact_phone']
                }
            }
            
            firebase_doc_id = firebase_service.create_user_document(firebase_data)
            
            # Update user profile with Firebase document ID
            profile = user.userprofile
            profile.firebase_uid = firebase_doc_id
            profile.save()
            
            # Auto-login the user
            login(request, user)
            
            messages.success(request, 'Registration successful! Welcome to MAES Hospital.')
            return redirect('patient_dashboard')
    else:
        form = PatientRegistrationForm()
    
    context = {
        'form': form,
        'title': 'Register - MAES Hospital'
    }
    return render(request, 'hospital_app/auth/register.html', context)

def logout_view(request):
    """Logout view"""
    user_name = request.user.get_full_name() or request.user.username if request.user.is_authenticated else None
    logout(request)
    
    if user_name:
        messages.success(request, f'Goodbye, {user_name}! You have been logged out successfully.')
    
    return redirect('home')

def forgot_password_view(request):
    """Forgot password view"""
    if request.method == 'POST':
        email = request.POST.get('email')
        
        try:
            user = User.objects.get(email=email)
            
            # Generate reset token
            reset_token = get_random_string(32)
            
            # Store token in session (in production, use database or cache)
            request.session[f'reset_token_{reset_token}'] = {
                'user_id': user.id,
                'email': email,
                'expires': (timezone.now() + timedelta(hours=1)).isoformat()
            }
            
            # Send reset email (in development, just show message)
            reset_url = request.build_absolute_uri(
                reverse('reset_password', kwargs={'token': reset_token})
            )
            
            # In production, send actual email
            # send_mail(
            #     'Password Reset - MAES Hospital',
            #     f'Click here to reset your password: {reset_url}',
            #     settings.DEFAULT_FROM_EMAIL,
            #     [email],
            #     fail_silently=False,
            # )
            
            messages.success(request, f'Password reset link has been sent to {email}. Check your email.')
            messages.info(request, f'Development: Reset link: {reset_url}')
            
        except User.DoesNotExist:
            messages.error(request, 'No account found with that email address.')
    
    return render(request, 'hospital_app/auth/forgot_password.html')

def reset_password_view(request, token):
    """Reset password view"""
    # Check if token is valid
    token_data = request.session.get(f'reset_token_{token}')
    
    if not token_data:
        messages.error(request, 'Invalid or expired reset token.')
        return redirect('forgot_password')
    
    # Check if token is expired
    from django.utils import timezone
    from datetime import datetime
    expires = datetime.fromisoformat(token_data['expires'])
    if timezone.now() > expires:
        messages.error(request, 'Reset token has expired. Please request a new one.')
        return redirect('forgot_password')
    
    if request.method == 'POST':
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        
        if password1 != password2:
            messages.error(request, 'Passwords do not match.')
        elif len(password1) < 8:
            messages.error(request, 'Password must be at least 8 characters long.')
        else:
            try:
                user = User.objects.get(id=token_data['user_id'])
                user.set_password(password1)
                user.save()
                
                # Remove token from session
                del request.session[f'reset_token_{token}']
                
                messages.success(request, 'Password reset successfully! You can now log in with your new password.')
                return redirect('login')
                
            except User.DoesNotExist:
                messages.error(request, 'User not found.')
                return redirect('forgot_password')
    
    context = {
        'token': token,
        'email': token_data['email']
    }
    return render(request, 'hospital_app/auth/reset_password.html', context)
