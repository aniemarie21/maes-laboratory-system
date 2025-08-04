from django.shortcuts import render, redirect
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import datetime
import json

from .firebase_models import (
    FirebaseUserModel, 
    FirebaseAppointmentModel, 
    FirebaseServiceModel, 
    FirebaseDepartmentModel,
    FirebasePaymentModel
)

# Initialize Firebase models
user_model = FirebaseUserModel()
appointment_model = FirebaseAppointmentModel()
service_model = FirebaseServiceModel()
department_model = FirebaseDepartmentModel()
payment_model = FirebasePaymentModel()

def firebase_home(request):
    """Homepage with Firebase data"""
    try:
        # Get data from Firebase
        services = service_model.get_all_services()
        departments = department_model.get_all_departments()
        
        # Mock statistics (you can implement real-time counting)
        stats = {
            'total_patients': 1250,
            'total_appointments': 3420,
            'total_services': len(services),
            'satisfaction_rate': 98.5,
        }
        
        context = {
            'stats': stats,
            'departments': departments[:6],
            'services': services[:8],
        }
        
        return render(request, 'hospital/firebase_home.html', context)
    
    except Exception as e:
        messages.error(request, f'Error loading data: {str(e)}')
        return render(request, 'hospital/firebase_home.html', {'stats': {}, 'departments': [], 'services': []})

@csrf_exempt
def firebase_register(request):
    """Register user with Firebase"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # User data
            user_data = {
                'email': data.get('email'),
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'phone_number': data.get('phone_number'),
                'role': 'patient',
                'is_active': True
            }
            
            # Create user in Firebase
            user_id = user_model.create_user(user_data)
            
            if user_id:
                return JsonResponse({
                    'success': True,
                    'message': 'User registered successfully!',
                    'user_id': user_id
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to register user'
                })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return render(request, 'hospital/firebase_register.html')

@csrf_exempt
def firebase_book_appointment(request):
    """Book appointment with Firebase"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Appointment data
            appointment_data = {
                'patient_id': data.get('patient_id'),
                'service_id': data.get('service_id'),
                'appointment_date': data.get('appointment_date'),
                'appointment_time': data.get('appointment_time'),
                'notes': data.get('notes', ''),
                'patient_name': data.get('patient_name'),
                'patient_email': data.get('patient_email'),
                'patient_phone': data.get('patient_phone')
            }
            
            # Create appointment in Firebase
            appointment_id = appointment_model.create_appointment(appointment_data)
            
            if appointment_id:
                return JsonResponse({
                    'success': True,
                    'message': 'Appointment booked successfully!',
                    'appointment_id': appointment_id
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to book appointment'
                })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    # Get services and departments for the form
    services = service_model.get_all_services()
    departments = department_model.get_all_departments()
    
    context = {
        'services': services,
        'departments': departments
    }
    
    return render(request, 'hospital/firebase_book_appointment.html', context)

@csrf_exempt
def firebase_patient_appointments(request, patient_id):
    """Get patient appointments from Firebase"""
    try:
        appointments = appointment_model.get_appointments_by_patient(patient_id)
        
        return JsonResponse({
            'success': True,
            'appointments': appointments
        })
    
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        })

@csrf_exempt
def firebase_create_payment(request):
    """Create payment record in Firebase"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            payment_data = {
                'appointment_id': data.get('appointment_id'),
                'amount': float(data.get('amount')),
                'payment_method': data.get('payment_method'),
                'reference_number': data.get('reference_number', ''),
                'patient_id': data.get('patient_id')
            }
            
            payment_id = payment_model.create_payment(payment_data)
            
            if payment_id:
                return JsonResponse({
                    'success': True,
                    'message': 'Payment recorded successfully!',
                    'payment_id': payment_id
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to record payment'
                })
        
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

def firebase_services_api(request):
    """API to get all services"""
    try:
        services = service_model.get_all_services()
        return JsonResponse({
            'success': True,
            'services': services
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        })

def firebase_departments_api(request):
    """API to get all departments"""
    try:
        departments = department_model.get_all_departments()
        return JsonResponse({
            'success': True,
            'departments': departments
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Error: {str(e)}'
        })
