from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db.models import Count, Sum, Q, Avg
from django.core.paginator import Paginator
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
import json
import csv

from .models import (
    UserProfile, Department, Service, Appointment, 
    TestResult, Payment, MedicalCertificate, Notification, AuditLog
)

def create_audit_log(request, action, model_name, object_id='', changes=None):
    """Create audit log entry"""
    AuditLog.objects.create(
        user=request.user if request.user.is_authenticated else None,
        action=action,
        model_name=model_name,
        object_id=str(object_id),
        changes=changes,
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', ''),
        session_key=request.session.session_key
    )

def home(request):
    """Modern homepage with statistics and features"""
    # Get statistics
    total_patients = User.objects.filter(userprofile__role='patient').count()
    total_appointments = Appointment.objects.count()
    total_services = Service.objects.filter(is_available=True).count()
    
    # Get recent data
    departments = Department.objects.filter(is_active=True)[:6]
    services = Service.objects.filter(is_available=True).select_related('department')[:8]
    recent_appointments = Appointment.objects.select_related('patient', 'service').order_by('-created_at')[:5]
    
    # Calculate satisfaction rate (mock data for demo)
    satisfaction_rate = 98.5
    
    context = {
        'total_patients': total_patients,
        'total_appointments': total_appointments,
        'total_services': total_services,
        'satisfaction_rate': satisfaction_rate,
        'departments': departments,
        'services': services,
        'recent_appointments': recent_appointments,
    }
    
    # Create audit log for homepage visit
    create_audit_log(request, 'view', 'Homepage')
    
    return render(request, 'hospital_app/home.html', context)

def login_view(request):
    """Modern login page with enhanced security"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember_me')
        
        if not username or not password:
            messages.error(request, 'Please enter both username and password.')
            return render(request, 'hospital_app/login.html')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                
                # Set session expiry based on remember me
                if not remember_me:
                    request.session.set_expiry(0)  # Browser session
                else:
                    request.session.set_expiry(1209600)  # 2 weeks
                
                # Create audit log
                create_audit_log(request, 'login', 'User', user.id)
                
                # Redirect based on user role
                try:
                    profile = user.userprofile
                    if profile.role == 'admin':
                        messages.success(request, f'Welcome back, {user.get_full_name()}!')
                        return redirect('admin_dashboard')
                    elif profile.role == 'patient':
                        messages.success(request, f'Welcome back, {user.get_full_name()}!')
                        return redirect('patient_dashboard')
                    else:
                        return redirect('home')
                except UserProfile.DoesNotExist:
                    messages.warning(request, 'Profile not found. Please contact administrator.')
                    return redirect('home')
            else:
                messages.error(request, 'Your account has been deactivated. Please contact administrator.')
        else:
            messages.error(request, 'Invalid username or password.')
            # Log failed login attempt
            create_audit_log(request, 'login', 'User', username, {'status': 'failed'})
    
    return render(request, 'hospital_app/login.html')

def register_view(request):
    """Modern registration page with validation"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        # Get form data
        username = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        phone_number = request.POST.get('phone_number', '').strip()
        
        # Validation
        errors = []
        
        if not all([username, email, password, confirm_password, first_name, last_name]):
            errors.append('All fields are required.')
        
        if password != confirm_password:
            errors.append('Passwords do not match.')
        
        if len(password) < 8:
            errors.append('Password must be at least 8 characters long.')
        
        if User.objects.filter(username=username).exists():
            errors.append('Username already exists.')
        
        if User.objects.filter(email=email).exists():
            errors.append('Email already registered.')
        
        if errors:
            for error in errors:
                messages.error(request, error)
            return render(request, 'hospital_app/register.html')
        
        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            
            # Update user profile
            profile = user.userprofile
            profile.role = 'patient'
            profile.phone_number = phone_number
            profile.save()
            
            # Create audit log
            create_audit_log(request, 'create', 'User', user.id)
            
            # Send welcome email (in production)
            if not settings.DEBUG:
                try:
                    send_mail(
                        'Welcome to MAES Laboratory',
                        f'Dear {first_name},\n\nWelcome to MAES Laboratory Management System. Your account has been created successfully.',
                        settings.DEFAULT_FROM_EMAIL,
                        [email],
                        fail_silently=True,
                    )
                except:
                    pass
            
            messages.success(request, 'Registration successful! Please log in with your credentials.')
            return redirect('login')
            
        except Exception as e:
            messages.error(request, 'Registration failed. Please try again.')
            return render(request, 'hospital_app/register.html')
    
    return render(request, 'hospital_app/register.html')

@login_required
def patient_dashboard(request):
    """Enhanced patient dashboard with comprehensive information"""
    if request.user.userprofile.role != 'patient':
        messages.error(request, 'Access denied. Patient access required.')
        return redirect('home')
    
    # Get user appointments
    appointments = Appointment.objects.filter(patient=request.user).order_by('-appointment_date')
    
    # Pagination
    paginator = Paginator(appointments, 10)
    page_number = request.GET.get('page')
    appointments_page = paginator.get_page(page_number)
    
    # Get test results
    recent_results = TestResult.objects.filter(
        appointment__patient=request.user,
        status='released'
    ).order_by('-released_at')[:5]
    
    # Get notifications
    notifications = Notification.objects.filter(
        user=request.user,
        is_read=False
    ).order_by('-created_at')[:5]
    
    # Get statistics
    stats = {
        'total_appointments': appointments.count(),
        'pending_appointments': appointments.filter(status='pending').count(),
        'completed_appointments': appointments.filter(status='completed').count(),
        'upcoming_appointments': appointments.filter(
            appointment_date__gte=timezone.now(),
            status__in=['pending', 'confirmed']
        ).count(),
    }
    
    # Get upcoming appointment
    next_appointment = appointments.filter(
        appointment_date__gte=timezone.now(),
        status__in=['pending', 'confirmed']
    ).first()
    
    context = {
        'appointments': appointments_page,
        'recent_results': recent_results,
        'notifications': notifications,
        'stats': stats,
        'next_appointment': next_appointment,
    }
    
    # Create audit log
    create_audit_log(request, 'view', 'PatientDashboard')
    
    return render(request, 'hospital_app/patient_dashboard.html', context)

@login_required
def admin_dashboard(request):
    """Enhanced admin dashboard with comprehensive analytics"""
    if request.user.userprofile.role != 'admin':
        messages.error(request, 'Access denied. Administrator access required.')
        return redirect('home')
    
    # Date ranges
    today = timezone.now().date()
    this_week = today - timedelta(days=7)
    this_month = today.replace(day=1)
    last_month = (this_month - timedelta(days=1)).replace(day=1)
    
    # Basic statistics
    stats = {
        'total_patients': User.objects.filter(userprofile__role='patient').count(),
        'total_appointments': Appointment.objects.count(),
        'today_appointments': Appointment.objects.filter(appointment_date__date=today).count(),
        'pending_appointments': Appointment.objects.filter(status='pending').count(),
        'completed_appointments': Appointment.objects.filter(status='completed').count(),
        'total_revenue': Payment.objects.filter(payment_status='completed').aggregate(
            total=Sum('amount'))['total'] or 0,
        'monthly_revenue': Payment.objects.filter(
            payment_date__gte=this_month,
            payment_status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0,
        'weekly_appointments': Appointment.objects.filter(
            created_at__gte=this_week
        ).count(),
    }
    
    # Recent activities
    recent_appointments = Appointment.objects.select_related(
        'patient', 'service'
    ).order_by('-created_at')[:10]
    
    recent_payments = Payment.objects.select_related(
        'appointment__patient'
    ).order_by('-payment_date')[:10]
    
    recent_results = TestResult.objects.select_related(
        'appointment__patient', 'appointment__service'
    ).order_by('-created_at')[:5]
    
    # Department statistics
    department_stats = Department.objects.annotate(
        appointment_count=Count('services__appointment'),
        revenue=Sum('services__appointment__payments__amount')
    ).filter(is_active=True)
    
    # Monthly appointment trends (last 6 months)
    monthly_data = []
    for i in range(6):
        month_start = (today.replace(day=1) - timedelta(days=30*i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        count = Appointment.objects.filter(
            appointment_date__date__range=[month_start, month_end]
        ).count()
        monthly_data.append({
            'month': month_start.strftime('%B %Y'),
            'count': count
        })
    
    # Service popularity
    popular_services = Service.objects.annotate(
        booking_count=Count('appointment')
    ).order_by('-booking_count')[:5]
    
    context = {
        'stats': stats,
        'recent_appointments': recent_appointments,
        'recent_payments': recent_payments,
        'recent_results': recent_results,
        'department_stats': department_stats,
        'monthly_data': monthly_data,
        'popular_services': popular_services,
    }
    
    # Create audit log
    create_audit_log(request, 'view', 'AdminDashboard')
    
    return render(request, 'hospital_app/admin_dashboard.html', context)

@login_required
def book_appointment(request):
    """Enhanced appointment booking with validation"""
    if request.method == 'POST':
        service_id = request.POST.get('service')
        appointment_date = request.POST.get('appointment_date')
        appointment_time = request.POST.get('appointment_time')
        notes = request.POST.get('notes', '')
        financial_assistance = request.POST.get('financial_assistance', 'none')
        
        # Validation
        if not all([service_id, appointment_date, appointment_time]):
            messages.error(request, 'Please fill in all required fields.')
            return redirect('book_appointment')
        
        try:
            service = get_object_or_404(Service, id=service_id, is_available=True)
            
            # Combine date and time
            appointment_datetime = datetime.strptime(f"{appointment_date} {appointment_time}", "%Y-%m-%d %H:%M")
            appointment_datetime = timezone.make_aware(appointment_datetime)
            
            # Check if appointment is in the future
            if appointment_datetime <= timezone.now():
                messages.error(request, 'Please select a future date and time.')
                return redirect('book_appointment')
            
            # Check for conflicts (optional - can be enhanced)
            existing_appointment = Appointment.objects.filter(
                patient=request.user,
                appointment_date=appointment_datetime,
                status__in=['pending', 'confirmed']
            ).exists()
            
            if existing_appointment:
                messages.error(request, 'You already have an appointment at this time.')
                return redirect('book_appointment')
            
            # Calculate pricing
            total_amount = service.price
            discount_amount = 0
            
            # Apply financial assistance discount
            if financial_assistance == 'hmo':
                discount_amount = total_amount * 0.8  # 80% HMO coverage
            elif financial_assistance == 'senior':
                discount_amount = total_amount * 0.2  # 20% senior discount
            elif financial_assistance == 'pwd':
                discount_amount = total_amount * 0.2  # 20% PWD discount
            
            # Create appointment
            appointment = Appointment.objects.create(
                patient=request.user,
                service=service,
                appointment_date=appointment_datetime,
                total_amount=total_amount,
                discount_amount=discount_amount,
                final_amount=total_amount - discount_amount,
                notes=notes
            )
            
            # Create audit log
            create_audit_log(request, 'create', 'Appointment', appointment.appointment_id)
            
            messages.success(request, f'Appointment booked successfully! Your appointment ID is {appointment.appointment_id}.')
            return redirect('patient_dashboard')
            
        except Exception as e:
            messages.error(request, 'Failed to book appointment. Please try again.')
            return redirect('book_appointment')
    
    # GET request - show booking form
    services = Service.objects.filter(is_available=True).select_related('department')
    departments = Department.objects.filter(is_active=True)
    
    context = {
        'services': services,
        'departments': departments,
    }
    
    return render(request, 'hospital_app/book_appointment.html', context)

@login_required
def view_appointment(request, appointment_id):
    """View detailed appointment information"""
    appointment = get_object_or_404(
        Appointment, 
        appointment_id=appointment_id,
        patient=request.user
    )
    
    # Get related data
    payments = appointment.payments.all().order_by('-payment_date')
    test_result = getattr(appointment, 'test_result', None)
    
    context = {
        'appointment': appointment,
        'payments': payments,
        'test_result': test_result,
    }
    
    # Create audit log
    create_audit_log(request, 'view', 'Appointment', appointment_id)
    
    return render(request, 'hospital_app/view_appointment.html', context)

@login_required
def cancel_appointment(request, appointment_id):
    """Cancel an appointment"""
    appointment = get_object_or_404(
        Appointment,
        appointment_id=appointment_id,
        patient=request.user
    )
    
    if appointment.status not in ['pending', 'confirmed']:
        messages.error(request, 'This appointment cannot be cancelled.')
        return redirect('patient_dashboard')
    
    if request.method == 'POST':
        appointment.status = 'cancelled'
        appointment.save()
        
        # Create notification
        Notification.objects.create(
            user=request.user,
            notification_type='appointment_cancelled',
            title='Appointment Cancelled',
            message=f'Your appointment for {appointment.service.name} on {appointment.appointment_date.strftime("%B %d, %Y at %I:%M %p")} has been cancelled.',
            related_appointment=appointment
        )
        
        # Create audit log
        create_audit_log(request, 'update', 'Appointment', appointment_id, {'status': 'cancelled'})
        
        messages.success(request, 'Appointment cancelled successfully.')
        return redirect('patient_dashboard')
    
    return render(request, 'hospital_app/cancel_appointment.html', {'appointment': appointment})

@login_required
def notifications_view(request):
    """View all notifications"""
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    
    # Mark notifications as read when viewed
    unread_notifications = notifications.filter(is_read=False)
    for notification in unread_notifications:
        notification.mark_as_read()
    
    # Pagination
    paginator = Paginator(notifications, 20)
    page_number = request.GET.get('page')
    notifications_page = paginator.get_page(page_number)
    
    context = {
        'notifications': notifications_page,
    }
    
    return render(request, 'hospital_app/notifications.html', context)

@login_required
def profile_view(request):
    """View and edit user profile"""
    profile = request.user.userprofile
    
    if request.method == 'POST':
        # Update user information
        request.user.first_name = request.POST.get('first_name', '')
        request.user.last_name = request.POST.get('last_name', '')
        request.user.email = request.POST.get('email', '')
        request.user.save()
        
        # Update profile information
        profile.phone_number = request.POST.get('phone_number', '')
        profile.address = request.POST.get('address', '')
        profile.emergency_contact = request.POST.get('emergency_contact', '')
        profile.emergency_phone = request.POST.get('emergency_phone', '')
        profile.notification_preference = request.POST.get('notification_preference', 'email')
        
        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            profile.profile_picture = request.FILES['profile_picture']
        
        profile.save()
        
        # Create audit log
        create_audit_log(request, 'update', 'UserProfile', profile.id)
        
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    
    context = {
        'profile': profile,
    }
    
    return render(request, 'hospital_app/profile.html', context)

def logout_view(request):
    """Enhanced logout with audit logging"""
    if request.user.is_authenticated:
        # Create audit log before logout
        create_audit_log(request, 'logout', 'User', request.user.id)
        
        user_name = request.user.get_full_name() or request.user.username
        logout(request)
        messages.success(request, f'Goodbye {user_name}! You have been logged out successfully.')
    
    return redirect('home')

@csrf_exempt
@require_http_methods(["POST"])
def chatbot_api(request):
    """Enhanced chatbot API with more responses"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '').lower().strip()
        
        if not message:
            return JsonResponse({'response': 'Please type a message.'})
        
        # Enhanced responses with more keywords
        responses = {
            # Greetings
            'hello': 'Hello! Welcome to MAES Laboratory. How can I assist you today?',
            'hi': 'Hi there! I\'m here to help you with any questions about our laboratory services.',
            'good morning': 'Good morning! How can I help you today?',
            'good afternoon': 'Good afternoon! What can I do for you?',
            'good evening': 'Good evening! How may I assist you?',
            
            # Services
            'services': 'We offer comprehensive laboratory services including blood tests, X-rays, ultrasound, ECG, microscopy, drug testing, vaccination, and DNA testing. Would you like details about any specific service?',
            'blood test': 'Our blood tests include complete blood count, lipid profile, blood sugar, liver function, kidney function, and more. Prices start from ₱500.',
            'xray': 'We provide digital X-ray services for chest, bone, and joint examinations. Price: ₱800, Duration: 15 minutes.',
            'ultrasound': 'High-resolution ultrasound imaging for abdominal, pelvic, and cardiac examinations. Price: ₱1,200, Duration: 30 minutes.',
            'ecg': 'Electrocardiogram testing for heart health monitoring. Price: ₱600, Duration: 20 minutes.',
            
            # Appointments
            'appointment': 'To book an appointment, please register/login and visit our booking page, or call us at (043) 286-2531. You can also book online 24/7.',
            'book': 'You can book appointments online through our website or call (043) 286-2531. Online booking is available 24/7.',
            'schedule': 'Our laboratory is open Monday to Saturday, 8:00 AM to 6:00 PM. You can schedule appointments during these hours.',
            'cancel': 'To cancel an appointment, please login to your account and go to your dashboard, or call us at (043) 286-2531.',
            
            # Hours and Location
            'hours': 'We are open Monday to Saturday, 8:00 AM to 6:00 PM. We are closed on Sundays and holidays.',
            'time': 'Our operating hours are Monday to Saturday, 8:00 AM to 6:00 PM.',
            'location': 'We are located in Batangas City, Philippines. Please visit our contact page for the exact address and directions.',
            'address': 'Our laboratory is located in Batangas City. For the exact address and directions, please check our contact page.',
            
            # Payment
            'payment': 'We accept cash, GCash, PayMaya, bank transfers, credit cards, HMO, and cheque payments. We also offer installment options.',
            'price': 'Our service prices vary. Blood tests start from ₱500, X-rays are ₱800, ECG is ₱600. Please check our services page for complete pricing.',
            'cost': 'Service costs depend on the type of test. We offer competitive pricing and accept various payment methods including HMO.',
            'insurance': 'We accept HMO and insurance coverage. Please bring your insurance card and valid ID.',
            
            # Results
            'results': 'Test results are usually available within 24-48 hours. You will be notified via SMS/email when ready. You can also check online.',
            'report': 'Laboratory reports are available online through your patient portal. You can also collect physical copies from our facility.',
            'when': 'Most test results are ready within 24-48 hours. Complex tests may take 3-5 days. We\'ll notify you when ready.',
            
            # Requirements
            'fasting': 'Some tests require 8-12 hours of fasting. We\'ll inform you of any special requirements when you book your appointment.',
            'preparation': 'Test preparation varies by service. We provide detailed instructions when you book. Some tests require fasting or special preparation.',
            'requirements': 'Please bring a valid ID and your appointment confirmation. Some tests may require fasting or special preparation.',
            
            # Contact
            'contact': 'You can reach us at (043) 286-2531 or email info@maeslaboratory.com. We\'re also available through this chat during business hours.',
            'phone': 'Our phone number is (043) 286-2531. We\'re available Monday to Saturday, 8:00 AM to 6:00 PM.',
            'email': 'You can email us at info@maeslaboratory.com for inquiries and appointments.',
            
            # Emergency
            'emergency': 'For medical emergencies, please call 911 or go to the nearest emergency room. Our laboratory provides diagnostic services, not emergency care.',
            'urgent': 'For urgent test results or appointments, please call us at (043) 286-2531. We offer priority scheduling for urgent cases.',
            
            # Technology
            'ai': 'We use AI-powered analysis to enhance accuracy and provide faster results. Our technology ensures 99.9% accuracy in diagnostics.',
            'technology': 'MAES Laboratory uses cutting-edge technology including AI analysis, digital imaging, and automated systems for accurate results.',
            
            # Help
            'help': 'I can help you with information about our services, booking appointments, payment options, test results, and general inquiries. What would you like to know?',
            'support': 'For technical support or detailed assistance, please call (043) 286-2531 or email info@maeslaboratory.com.',
        }
        
        # Find matching response
        response = None
        for keyword, reply in responses.items():
            if keyword in message:
                response = reply
                break
        
        # Default response if no match found
        if not response:
            if '?' in message:
                response = 'I\'d be happy to help! For specific questions, please call us at (043) 286-2531 or email info@maeslaboratory.com. Our staff can provide detailed assistance.'
            else:
                response = 'Thank you for your message. For detailed information about our services, appointments, or any other inquiries, please contact us at (043) 286-2531 or visit our website.'
        
        # Add helpful suggestions
        suggestions = [
            'Book an appointment',
            'View our services',
            'Check operating hours',
            'Payment options',
            'Contact information'
        ]
        
        return JsonResponse({
            'response': response,
            'suggestions': suggestions
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong. Please try again.'})

# API Views for AJAX requests
@login_required
def get_services_by_department(request, department_id):
    """Get services filtered by department"""
    services = Service.objects.filter(
        department_id=department_id,
        is_available=True
    ).values('id', 'name', 'price', 'duration_minutes', 'requires_fasting')
    
    return JsonResponse({'services': list(services)})

@login_required
def check_appointment_availability(request):
    """Check if appointment slot is available"""
    date = request.GET.get('date')
    time = request.GET.get('time')
    service_id = request.GET.get('service_id')
    
    if not all([date, time, service_id]):
        return JsonResponse({'available': False, 'message': 'Missing parameters'})
    
    try:
        appointment_datetime = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
        appointment_datetime = timezone.make_aware(appointment_datetime)
        
        # Check if slot is taken
        existing = Appointment.objects.filter(
            appointment_date=appointment_datetime,
            service_id=service_id,
            status__in=['pending', 'confirmed']
        ).exists()
        
        return JsonResponse({
            'available': not existing,
            'message': 'Slot available' if not existing else 'Slot already taken'
        })
        
    except ValueError:
        return JsonResponse({'available': False, 'message': 'Invalid date/time format'})

@login_required
def export_appointments(request):
    """Export appointments to CSV"""
    if request.user.userprofile.role != 'admin':
        return JsonResponse({'error': 'Access denied'})
    
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="appointments.csv"'
    
    writer = csv.writer(response)
    writer.writerow([
        'Appointment ID', 'Patient Name', 'Service', 'Date', 'Status', 
        'Payment Status', 'Amount', 'Created At'
    ])
    
    appointments = Appointment.objects.select_related('patient', 'service').all()
    for appointment in appointments:
        writer.writerow([
            appointment.appointment_id,
            appointment.patient.get_full_name(),
            appointment.service.name,
            appointment.appointment_date.strftime('%Y-%m-%d %H:%M'),
            appointment.get_status_display(),
            appointment.get_payment_status_display(),
            appointment.final_amount,
            appointment.created_at.strftime('%Y-%m-%d %H:%M')
        ])
    
    # Create audit log
    create_audit_log(request, 'export', 'Appointments')
    
    return response

# Error handlers
def handler404(request, exception):
    """Custom 404 error page"""
    return render(request, 'hospital_app/404.html', status=404)

def handler500(request):
    """Custom 500 error page"""
    return render(request, 'hospital_app/500.html', status=500)

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
