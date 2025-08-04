from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Count, Sum
from datetime import datetime, timedelta
import json

from .models import UserProfile, Department, Service, Appointment, TestResult, Payment

def home(request):
    """Homepage with statistics and features"""
    stats = {
        'total_patients': User.objects.filter(userprofile__role='patient').count(),
        'total_appointments': Appointment.objects.count(),
        'total_services': Service.objects.filter(is_available=True).count(),
        'satisfaction_rate': 98.5,
    }
    
    departments = Department.objects.filter(is_active=True)[:6]
    services = Service.objects.filter(is_available=True)[:8]
    recent_appointments = Appointment.objects.select_related('patient', 'service').order_by('-created_at')[:5]
    
    context = {
        'stats': stats,
        'departments': departments,
        'services': services,
        'recent_appointments': recent_appointments,
    }
    
    return render(request, 'hospital/home.html', context)

def login_view(request):
    """Login page"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            
            # Redirect based on user role
            try:
                profile = user.userprofile
                if profile.role == 'admin':
                    return redirect('admin_dashboard')
                elif profile.role == 'patient':
                    return redirect('patient_dashboard')
                else:
                    return redirect('home')
            except UserProfile.DoesNotExist:
                return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    
    return render(request, 'hospital/login.html')

def register_view(request):
    """Registration page"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')
        
        # Validation
        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'hospital/register.html')
        
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'hospital/register.html')
        
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return render(request, 'hospital/register.html')
        
        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Create user profile
        UserProfile.objects.create(
            user=user,
            role='patient',
            phone_number=phone_number
        )
        
        messages.success(request, 'Registration successful! Please log in.')
        return redirect('login')
    
    return render(request, 'hospital/register.html')

@login_required
def patient_dashboard(request):
    """Patient dashboard"""
    if request.user.userprofile.role != 'patient':
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    appointments = Appointment.objects.filter(patient=request.user).order_by('-appointment_date')[:10]
    
    stats = {
        'total_appointments': appointments.count(),
        'pending_appointments': appointments.filter(status='pending').count(),
        'completed_appointments': appointments.filter(status='completed').count(),
    }
    
    context = {
        'appointments': appointments,
        'stats': stats,
    }
    
    return render(request, 'hospital/patient_dashboard.html', context)

@login_required
def admin_dashboard(request):
    """Admin dashboard"""
    if request.user.userprofile.role != 'admin':
        messages.error(request, 'Access denied.')
        return redirect('home')
    
    today = timezone.now().date()
    this_month = today.replace(day=1)
    
    stats = {
        'total_patients': User.objects.filter(userprofile__role='patient').count(),
        'total_appointments': Appointment.objects.count(),
        'today_appointments': Appointment.objects.filter(appointment_date__date=today).count(),
        'pending_appointments': Appointment.objects.filter(status='pending').count(),
        'monthly_revenue': Payment.objects.filter(
            payment_date__gte=this_month,
            is_verified=True
        ).aggregate(total=Sum('amount'))['total'] or 0,
    }
    
    recent_appointments = Appointment.objects.select_related('patient', 'service').order_by('-created_at')[:10]
    recent_payments = Payment.objects.select_related('appointment__patient').order_by('-payment_date')[:10]
    
    context = {
        'stats': stats,
        'recent_appointments': recent_appointments,
        'recent_payments': recent_payments,
    }
    
    return render(request, 'hospital/admin_dashboard.html', context)

@login_required
def book_appointment(request):
    """Book appointment"""
    if request.method == 'POST':
        service_id = request.POST.get('service')
        appointment_date = request.POST.get('appointment_date')
        appointment_time = request.POST.get('appointment_time')
        notes = request.POST.get('notes', '')
        
        service = get_object_or_404(Service, id=service_id)
        
        # Combine date and time
        appointment_datetime = datetime.strptime(f"{appointment_date} {appointment_time}", "%Y-%m-%d %H:%M")
        appointment_datetime = timezone.make_aware(appointment_datetime)
        
        # Create appointment
        appointment = Appointment.objects.create(
            patient=request.user,
            service=service,
            appointment_date=appointment_datetime,
            notes=notes
        )
        
        messages.success(request, 'Appointment booked successfully!')
        return redirect('patient_dashboard')
    
    services = Service.objects.filter(is_available=True).select_related('department')
    departments = Department.objects.filter(is_active=True)
    
    context = {
        'services': services,
        'departments': departments,
    }
    
    return render(request, 'hospital/book_appointment.html', context)

def logout_view(request):
    """Logout user"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('home')

@csrf_exempt
def chatbot_api(request):
    """Chatbot API"""
    if request.method == 'POST':
        data = json.loads(request.body)
        message = data.get('message', '').lower()
        
        responses = {
            'hello': 'Hello! How can I help you today?',
            'hi': 'Hi there! What can I do for you?',
            'appointment': 'To book an appointment, please visit our booking page or call (043) 286-2531.',
            'hours': 'We are open Monday to Saturday, 8:00 AM to 6:00 PM.',
            'location': 'We are located at Batangas City. You can find our exact address on our contact page.',
            'services': 'We offer various laboratory services including blood tests, X-rays, ultrasound, and more.',
            'payment': 'We accept cash, GCash, PayMaya, bank transfers, and major credit cards.',
            'results': 'Test results are usually available within 24-48 hours. You will be notified when ready.',
        }
        
        response = 'I\'m sorry, I didn\'t understand that. Please contact our staff for more information.'
        
        for keyword, reply in responses.items():
            if keyword in message:
                response = reply
                break
        
        return JsonResponse({'response': response})
    
    return JsonResponse({'error': 'Invalid request method'})
