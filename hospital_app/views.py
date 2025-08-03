"""
Views for MAES Hospital Management System
Django + Firebase integration
"""

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.core.paginator import Paginator
from django.db.models import Q, Count, Sum
from django.contrib.auth.models import User
from django.conf import settings
from .models import (
    UserProfile, LabService, Appointment, TestResult, 
    PaymentTransaction, ChatSession, SystemSettings
)
from .firebase_service import get_firebase_service
import json
import uuid
from datetime import datetime, timedelta, date

def home(request):
    """Homepage for MAES Laboratory"""
    # Get featured services
    featured_services = LabService.objects.filter(
        is_active=True, 
        priority_service=True
    )[:6]
    
    # Get all active services for count
    total_services = LabService.objects.filter(is_active=True).count()
    
    # Get statistics
    total_patients = User.objects.filter(userprofile__user_type='patient').count()
    total_appointments = Appointment.objects.count()
    
    context = {
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
        'hospital_phone': settings.HOSPITAL_CONFIG['phone'],
        'hospital_email': settings.HOSPITAL_CONFIG['email'],
        'hospital_address': settings.HOSPITAL_CONFIG['address'],
        'featured_services': featured_services,
        'total_services': total_services,
        'total_patients': total_patients,
        'total_appointments': total_appointments,
        'operating_hours': settings.HOSPITAL_CONFIG['operating_hours'],
        'services_list': settings.HOSPITAL_CONFIG['services'],
    }
    
    return render(request, 'hospital_app/home.html', context)

@login_required
def dashboard(request):
    """Dashboard - redirects based on user type"""
    try:
        profile = request.user.userprofile
        if profile.user_type == 'admin':
            return redirect('admin_dashboard')
        else:
            return redirect('patient_dashboard')
    except UserProfile.DoesNotExist:
        # Create patient profile if it doesn't exist
        UserProfile.objects.create(
            user=request.user,
            user_type='patient'
        )
        return redirect('patient_dashboard')

@login_required
def patient_dashboard(request):
    """Patient dashboard"""
    try:
        profile = request.user.userprofile
        if profile.user_type != 'patient':
            return redirect('admin_dashboard')
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(
            user=request.user,
            user_type='patient'
        )
    
    # Get recent appointments
    recent_appointments = Appointment.objects.filter(
        patient=request.user
    ).order_by('-created_at')[:5]
    
    # Get recent test results
    recent_results = TestResult.objects.filter(
        patient=request.user
    ).order_by('-created_at')[:5]
    
    # Get pending payments
    pending_payments = PaymentTransaction.objects.filter(
        patient=request.user,
        status='pending'
    ).count()
    
    # Calculate statistics
    stats = {
        'total_appointments': Appointment.objects.filter(patient=request.user).count(),
        'completed_tests': TestResult.objects.filter(patient=request.user, status='completed').count(),
        'pending_payments': pending_payments,
    }
    
    context = {
        'profile': profile,
        'recent_appointments': recent_appointments,
        'recent_results': recent_results,
        'stats': stats,
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
    }
    
    return render(request, 'hospital_app/patient_dashboard.html', context)

@login_required
def admin_dashboard(request):
    """Admin dashboard"""
    try:
        profile = request.user.userprofile
        if profile.user_type != 'admin':
            messages.error(request, 'Access denied. Admin privileges required.')
            return redirect('patient_dashboard')
    except UserProfile.DoesNotExist:
        messages.error(request, 'Access denied. Admin privileges required.')
        return redirect('home')
    
    # Get Firebase analytics
    firebase_service = get_firebase_service()
    analytics = firebase_service.get_dashboard_analytics()
    
    # Get today's statistics
    today = date.today()
    today_appointments = Appointment.objects.filter(appointment_date=today).count()
    pending_payments = PaymentTransaction.objects.filter(status='pending').count()
    
    # Get recent activities
    recent_appointments = Appointment.objects.all().order_by('-created_at')[:10]
    recent_payments = PaymentTransaction.objects.filter(
        status='completed'
    ).order_by('-created_at')[:10]
    
    # Monthly revenue
    current_month = timezone.now().replace(day=1)
    monthly_revenue = PaymentTransaction.objects.filter(
        status='completed',
        payment_date__gte=current_month
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    context = {
        'analytics': analytics,
        'today_appointments': today_appointments,
        'pending_payments': pending_payments,
        'recent_appointments': recent_appointments,
        'recent_payments': recent_payments,
        'monthly_revenue': monthly_revenue,
        'total_patients': User.objects.filter(userprofile__user_type='patient').count(),
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
    }
    
    return render(request, 'hospital_app/admin_dashboard.html', context)

@login_required
def book_appointment(request):
    """Book appointment page"""
    if request.method == 'POST':
        # Get form data
        service_ids = request.POST.getlist('services')
        appointment_date = request.POST.get('appointment_date')
        appointment_time = request.POST.get('appointment_time')
        payment_method = request.POST.get('payment_method')
        notes = request.POST.get('notes', '')
        
        # Validate required fields
        if not service_ids or not appointment_date or not appointment_time:
            messages.error(request, 'Please fill in all required fields.')
            return redirect('book_appointment')
        
        # Create appointment
        appointment = Appointment.objects.create(
            patient=request.user,
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            payment_method=payment_method,
            notes=notes,
            status='pending'
        )
        
        # Add selected services
        services = LabService.objects.filter(id__in=service_ids)
        appointment.services.set(services)
        
        # Calculate total amount
        appointment.calculate_total()
        appointment.save()
        
        # Create Firebase document
        firebase_service = get_firebase_service()
        firebase_data = {
            'appointment_id': str(appointment.appointment_id),
            'patient_id': str(request.user.id),
            'patient_name': request.user.get_full_name(),
            'patient_email': request.user.email,
            'services': [service.name for service in services],
            'appointment_date': appointment_date,
            'appointment_time': appointment_time,
            'total_amount': float(appointment.total_amount),
            'payment_method': payment_method,
            'status': 'pending',
            'notes': notes
        }
        
        firebase_doc_id = firebase_service.create_appointment(firebase_data)
        appointment.firebase_doc_id = firebase_doc_id
        appointment.save()
        
        messages.success(request, f'Appointment booked successfully! Total amount: ₱{appointment.total_amount}')
        return redirect('patient_dashboard')
    
    # GET request - show booking form
    services = LabService.objects.filter(is_active=True).order_by('category', 'name')
    
    # Group services by category
    services_by_category = {}
    for service in services:
        category = service.get_category_display()
        if category not in services_by_category:
            services_by_category[category] = []
        services_by_category[category].append(service)
    
    context = {
        'services_by_category': services_by_category,
        'payment_methods': Appointment.PAYMENT_METHODS,
    }
    
    return render(request, 'hospital_app/book_appointment.html', context)

@login_required
def view_appointments(request):
    """View appointments"""
    if hasattr(request.user, 'userprofile') and request.user.userprofile.user_type == 'admin':
        appointments = Appointment.objects.all().order_by('-created_at')
    else:
        appointments = Appointment.objects.filter(patient=request.user).order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        appointments = appointments.filter(status=status_filter)
    
    # Pagination
    paginator = Paginator(appointments, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'status_filter': status_filter,
        'is_admin': hasattr(request.user, 'userprofile') and request.user.userprofile.user_type == 'admin',
        'status_choices': Appointment.STATUS_CHOICES,
    }
    
    return render(request, 'hospital_app/view_appointments.html', context)

@login_required
def view_test_results(request):
    """View test results"""
    if hasattr(request.user, 'userprofile') and request.user.userprofile.user_type == 'admin':
        results = TestResult.objects.all().order_by('-created_at')
    else:
        results = TestResult.objects.filter(patient=request.user).order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        results = results.filter(status=status_filter)
    
    # Pagination
    paginator = Paginator(results, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'status_filter': status_filter,
        'is_admin': hasattr(request.user, 'userprofile') and request.user.userprofile.user_type == 'admin',
        'status_choices': TestResult.RESULT_STATUS,
    }
    
    return render(request, 'hospital_app/view_test_results.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_api(request):
    """Chatbot API for MAES Laboratory"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip().lower()
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        # MAES Laboratory chatbot responses
        responses = {
            'hello': f'Hello! Welcome to {settings.HOSPITAL_CONFIG["name"]} 🏥\n\nI can help you with:\n• Laboratory services and pricing\n• Appointment booking\n• Operating hours\n• Contact information\n• Test results inquiry\n\nHow can I assist you today?',
            
            'hi': 'Hi there! I\'m your MAES Laboratory assistant. How can I help you today? 😊',
            
            'services': f'Our Laboratory Services:\n\n🩸 **Hematology:**\n• Complete Blood Count (CBC) - ₱350\n• Blood Typing - ₱200\n\n🧪 **Clinical Chemistry:**\n• Fasting Blood Sugar - ₱150\n• Lipid Profile - ₱600\n\n🔬 **Clinical Microscopy:**\n• Urinalysis - ₱200\n• Stool Examination - ₱250\n\n📡 **Radiology:**\n• Chest X-Ray - ₱500\n• ECG - ₱300\n\nWould you like to book an appointment?',
            
            'appointment': 'To book an appointment:\n\n1. 📝 Register or log in to your account\n2. 🔬 Select "Book Appointment"\n3. 🧪 Choose your laboratory services\n4. 📅 Pick your preferred date and time\n5. 💳 Select payment method\n6. ✅ Confirm your booking\n\nYou can book online 24/7!',
            
            'hours': f'**{settings.HOSPITAL_CONFIG["name"]} Operating Hours:**\n\n🕐 **Laboratory Services:**\n• Weekdays: {settings.HOSPITAL_CONFIG["operating_hours"]["weekdays"]}\n• Saturday: {settings.HOSPITAL_CONFIG["operating_hours"]["saturday"]}\n• Sunday: {settings.HOSPITAL_CONFIG["operating_hours"]["sunday"]}\n\n🚨 **Emergency Services:** {settings.HOSPITAL_CONFIG["operating_hours"]["emergency"]}\n\nWe\'re here to serve you!',
            
            'contact': f'**Contact Information:**\n\n📞 **Phone:** {settings.HOSPITAL_CONFIG["phone"]}\n📧 **Email:** {settings.HOSPITAL_CONFIG["email"]}\n📍 **Address:** {settings.HOSPITAL_CONFIG["address"]}\n\n🌐 **Website:** {settings.HOSPITAL_CONFIG["website"]}\n\nFeel free to reach out anytime!',
            
            'location': f'**Our Location:**\n\n📍 {settings.HOSPITAL_CONFIG["address"]}\n\n🚗 **Getting Here:**\n• Accessible by public transportation\n• Parking available on-site\n• Located along the main highway\n\n📞 For directions, call: {settings.HOSPITAL_CONFIG["phone"]}',
            
            'payment': 'We accept various payment methods:\n\n💳 **Digital Payments:**\n• GCash\n• PayMaya\n• Bank Transfer\n• Credit/Debit Cards\n\n💰 **Traditional:**\n• Cash payments\n• Check payments\n\n🏥 **Insurance:**\n• PhilHealth\n• HMO coverage\n• Company guarantee letters\n\nChoose what\'s convenient for you!',
            
            'results': 'To check your test results:\n\n1. 🔐 Log in to your patient account\n2. 📊 Go to "Test Results" section\n3. 📋 View your completed tests\n4. 📱 Get notified via SMS/email when ready\n\n⏰ **Result Times:**\n• Most tests: 2-4 hours\n• Special tests: 24-48 hours\n• Emergency tests: 1-2 hours\n\nWe\'ll notify you when results are ready!',
            
            'help': 'I can help you with:\n\n🔬 **Laboratory Services:**\n• Available tests and pricing\n• Test preparation instructions\n• Result turnaround times\n\n📅 **Appointments:**\n• Online booking process\n• Available time slots\n• Rescheduling appointments\n\n💳 **Payments:**\n• Payment methods\n• Billing inquiries\n• Insurance coverage\n\n📞 **Contact:**\n• Hospital information\n• Operating hours\n• Location and directions\n\nWhat would you like to know more about?',
            
            'price': 'Our competitive laboratory prices:\n\n💰 **Popular Tests:**\n• CBC - ₱350\n• FBS - ₱150\n• Lipid Profile - ₱600\n• Urinalysis - ₱200\n• Chest X-Ray - ₱500\n• ECG - ₱300\n\n🎯 **Package Deals:**\n• Basic Health Package - ₱1,200\n• Executive Package - ₱2,500\n• Pre-Employment Package - ₱1,800\n\n💡 Prices are inclusive of professional fees!',
        }
        
        # Find matching response
        response = None
        for key, value in responses.items():
            if key in message:
                response = value
                break
        
        if not response:
            response = f"I'm sorry, I didn't understand that. Here are some things I can help you with:\n\n💡 **Try asking about:**\n• 'services' - Our laboratory tests\n• 'appointment' - How to book\n• 'hours' - Operating hours\n• 'contact' - Contact information\n• 'payment' - Payment methods\n• 'results' - Test results\n• 'help' - Complete help menu\n\nOr call us at {settings.HOSPITAL_CONFIG['phone']} for immediate assistance!"
        
        # Save chat message to Firebase if user is authenticated
        if request.user.is_authenticated:
            firebase_service = get_firebase_service()
            firebase_service.save_chat_message({
                'session_id': session_id,
                'user_id': str(request.user.id),
                'message': data.get('message', ''),
                'response': response,
                'message_type': 'user'
            })
        
        return JsonResponse({
            'response': response,
            'session_id': session_id,
            'timestamp': datetime.now().isoformat(),
            'hospital': settings.HOSPITAL_CONFIG['name']
        })
        
    except Exception as e:
        return JsonResponse({
            'error': f'Sorry, I encountered an error. Please try again or contact us at {settings.HOSPITAL_CONFIG["phone"]}.',
            'details': str(e)
        }, status=500)

def user_login(request):
    """User login page"""
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user_type = request.POST.get('user_type', 'patient')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            
            # Create or update user profile
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={'user_type': user_type}
            )
            
            messages.success(request, f'Welcome back, {user.get_full_name() or user.username}!')
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')
    
    context = {
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
    }
    return render(request, 'hospital_app/login.html', context)

def user_register(request):
    """User registration page"""
    if request.method == 'POST':
        # Get form data
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        phone = request.POST.get('phone')
        date_of_birth = request.POST.get('date_of_birth')
        address = request.POST.get('address')
        
        # Validate passwords match
        if password != confirm_password:
            messages.error(request, 'Passwords do not match.')
            return render(request, 'hospital_app/register.html')
        
        # Check if username exists
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists.')
            return render(request, 'hospital_app/register.html')
        
        # Check if email exists
        if User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered.')
            return render(request, 'hospital_app/register.html')
        
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
            user_type='patient',
            phone=phone,
            date_of_birth=date_of_birth if date_of_birth else None,
            address=address
        )
        
        # Create Firebase user profile
        firebase_service = get_firebase_service()
        firebase_data = {
            'user_id': str(user.id),
            'username': username,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone,
            'date_of_birth': date_of_birth,
            'address': address,
            'user_type': 'patient'
        }
        firebase_service.create_user_profile(firebase_data)
        
        messages.success(request, 'Registration successful! You can now log in.')
        return redirect('login')
    
    context = {
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
    }
    return render(request, 'hospital_app/register.html', context)

def user_logout(request):
    """User logout"""
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('home')

def about(request):
    """About page for MAES Laboratory"""
    context = {
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
        'hospital_address': settings.HOSPITAL_CONFIG['address'],
        'hospital_phone': settings.HOSPITAL_CONFIG['phone'],
        'hospital_email': settings.HOSPITAL_CONFIG['email'],
        'operating_hours': settings.HOSPITAL_CONFIG['operating_hours'],
        'services_count': LabService.objects.filter(is_active=True).count(),
        'established_year': '1995',
        'total_staff': '150+',
    }
    return render(request, 'hospital_app/about.html', context)

def contact(request):
    """Contact page for MAES Laboratory"""
    context = {
        'hospital_name': settings.HOSPITAL_CONFIG['name'],
        'hospital_address': settings.HOSPITAL_CONFIG['address'],
        'hospital_phone': settings.HOSPITAL_CONFIG['phone'],
        'hospital_email': settings.HOSPITAL_CONFIG['email'],
        'operating_hours': settings.HOSPITAL_CONFIG['operating_hours'],
    }
    return render(request, 'hospital_app/contact.html', context)

def services(request):
    """Services page listing all laboratory tests"""
    services = LabService.objects.filter(is_active=True).order_by('category', 'name')
    
    # Group services by category
    services_by_category = {}
    for service in services:
        category = service.get_category_display()
        if category not in services_by_category:
            services_by_category[category] = []
        services_by_category[category].append(service)
    
    context = {
        'services_by_category': services_by_category,
        'total_services': services.count(),
    }
    
    return render(request, 'hospital_app/services.html', context)

@login_required
def payment_settings(request):
    """Payment settings view (admin only)"""
    try:
        profile = request.user.userprofile
        if profile.user_type != 'admin':
            messages.error(request, 'Access denied. Admin privileges required.')
            return redirect('home')
    except UserProfile.DoesNotExist:
        messages.error(request, 'Access denied. Admin privileges required.')
        return redirect('home')
    
    firebase_service = get_firebase_service()
    
    if request.method == 'POST':
        # Handle payment settings update
        settings_data = {
            'gcash_number': request.POST.get('gcash_number'),
            'gcash_name': request.POST.get('gcash_name'),
            'paymaya_number': request.POST.get('paymaya_number'),
            'bank_account_number': request.POST.get('bank_account_number'),
            'bank_name': request.POST.get('bank_name'),
            'bank_account_name': request.POST.get('bank_account_name'),
            'payment_instructions': request.POST.get('payment_instructions'),
            'auto_verify_payments': request.POST.get('auto_verify_payments') == 'on',
            'payment_verification_hours': request.POST.get('payment_verification_hours', '24')
        }
        
        firebase_service.update_payment_settings(settings_data)
        messages.success(request, 'Payment settings updated successfully!')
        return redirect('payment_settings')
    
    # Get current settings
    payment_settings = firebase_service.get_payment_settings()
    
    # Get payment statistics
    payment_stats = {
        'total_transactions': PaymentTransaction.objects.count(),
        'completed_payments': PaymentTransaction.objects.filter(status='completed').count(),
        'pending_verification': PaymentTransaction.objects.filter(status='processing').count(),
        'failed_payments': PaymentTransaction.objects.filter(status='failed').count(),
        'total_revenue': PaymentTransaction.objects.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0,
        'gcash_payments': PaymentTransaction.objects.filter(
            payment_method='gcash', status='completed'
        ).count(),
        'bank_transfer_payments': PaymentTransaction.objects.filter(
            payment_method='bank_transfer', status='completed'
        ).count(),
    }
    
    context = {
        'payment_settings': payment_settings,
        'payment_stats': payment_stats,
    }
    
    return render(request, 'hospital_app/payment_settings.html', context)

@login_required
def notification_preferences(request):
    """Update notification preferences"""
    try:
        profile = request.user.userprofile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user, user_type='patient')
    
    if request.method == 'POST':
        notification_preference = request.POST.get('notification_preference')
        if notification_preference in ['sms', 'email', 'both']:
            profile.notification_preference = notification_preference
            profile.save()
            messages.success(request, 'Notification preferences updated successfully!')
        else:
            messages.error(request, 'Invalid notification preference.')
        
        return redirect('patient_dashboard')
    
    context = {
        'profile': profile,
        'notification_choices': UserProfile._meta.get_field('notification_preference').choices,
    }
    
    return render(request, 'hospital_app/notification_preferences.html', context)
