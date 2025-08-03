"""
Django models for MAES Hospital Management System.
Integrated with Firebase for real-time data synchronization.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import uuid
import json

class UserProfile(models.Model):
    """Extended user profile for hospital system"""
    USER_TYPES = [
        ('patient', 'Patient'),
        ('admin', 'Administrator'),
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        ('technician', 'Laboratory Technician'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='patient')
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    # Firebase integration
    firebase_uid = models.CharField(max_length=100, blank=True, unique=True)
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    # Preferences
    notification_preference = models.CharField(
        max_length=10,
        choices=[('sms', 'SMS'), ('email', 'Email'), ('both', 'Both')],
        default='email'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.user_type})"
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

class LabService(models.Model):
    """Laboratory services offered by MAES Hospital"""
    CATEGORIES = [
        ('hematology', 'Hematology'),
        ('chemistry', 'Clinical Chemistry'),
        ('microbiology', 'Microbiology'),
        ('immunology', 'Immunology'),
        ('pathology', 'Pathology'),
        ('radiology', 'Radiology'),
        ('cardiology', 'Cardiology'),
    ]
    
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORIES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_hours = models.IntegerField(help_text="Expected result time in hours")
    preparation_instructions = models.TextField(blank=True)
    
    # Service features
    is_active = models.BooleanField(default=True)
    requires_fasting = models.BooleanField(default=False)
    is_walk_in_available = models.BooleanField(default=True)
    priority_service = models.BooleanField(default=False)
    ai_analysis_available = models.BooleanField(default=True)
    
    # Firebase integration
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - ₱{self.price}"
    
    class Meta:
        verbose_name = "Laboratory Service"
        verbose_name_plural = "Laboratory Services"
        ordering = ['category', 'name']

class Appointment(models.Model):
    """Patient appointments for laboratory services"""
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('gcash', 'GCash'),
        ('paymaya', 'PayMaya'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
    ]
    
    appointment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    services = models.ManyToManyField(LabService)
    
    # Appointment details
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment information
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    payment_reference = models.CharField(max_length=100, blank=True)
    
    # Additional information
    notes = models.TextField(blank=True)
    queue_number = models.CharField(max_length=10, blank=True)
    estimated_wait_time = models.IntegerField(default=0)
    
    # Firebase integration
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient.get_full_name()}"
    
    def get_services_list(self):
        return ", ".join([service.name for service in self.services.all()])
    
    def calculate_total(self):
        """Calculate total amount for all services"""
        total = sum(service.price for service in self.services.all())
        self.total_amount = total
        return total
    
    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"
        ordering = ['-created_at']

class TestResult(models.Model):
    """Laboratory test results"""
    RESULT_STATUS = [
        ('pending', 'Sample Collected'),
        ('in_progress', 'Analysis In Progress'),
        ('completed', 'Results Ready'),
        ('reviewed', 'Doctor Reviewed'),
        ('released', 'Released to Patient'),
    ]
    
    result_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='test_results')
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_results')
    service = models.ForeignKey(LabService, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=20, choices=RESULT_STATUS, default='pending')
    
    # Test results data (stored as JSON)
    result_data = models.JSONField(default=dict, blank=True)
    normal_ranges = models.JSONField(default=dict, blank=True)
    ai_analysis = models.JSONField(default=dict, blank=True)
    
    # Medical review
    technician_notes = models.TextField(blank=True)
    doctor_review = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='reviewed_results'
    )
    
    # Result files
    result_pdf = models.FileField(upload_to='test_results/', blank=True, null=True)
    
    # Notifications
    patient_notified = models.BooleanField(default=False)
    notification_sent_at = models.DateTimeField(null=True, blank=True)
    
    # Firebase integration
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Result {self.result_id} - {self.service.name}"
    
    class Meta:
        verbose_name = "Test Result"
        verbose_name_plural = "Test Results"
        ordering = ['-created_at']

class PaymentTransaction(models.Model):
    """Payment transactions"""
    TRANSACTION_STATUS = [
        ('pending', 'Payment Pending'),
        ('processing', 'Processing Payment'),
        ('completed', 'Payment Successful'),
        ('failed', 'Payment Failed'),
        ('refunded', 'Payment Refunded'),
    ]
    
    transaction_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_transactions')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    
    # Payment details
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=Appointment.PAYMENT_METHODS)
    payment_reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=TRANSACTION_STATUS, default='pending')
    
    # Processing information
    payment_date = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='processed_payments'
    )
    
    # Additional information
    payment_details = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    
    # Firebase integration
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.transaction_id} - ₱{self.amount}"
    
    class Meta:
        verbose_name = "Payment Transaction"
        verbose_name_plural = "Payment Transactions"
        ordering = ['-created_at']

class ChatSession(models.Model):
    """Chat support sessions"""
    SESSION_TYPES = [
        ('general_inquiry', 'General Inquiry'),
        ('appointment_help', 'Appointment Help'),
        ('payment_support', 'Payment Support'),
        ('result_inquiry', 'Test Result Inquiry'),
        ('technical_support', 'Technical Support'),
    ]
    
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='general_inquiry')
    
    is_active = models.BooleanField(default=True)
    admin_assigned = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='assigned_chats'
    )
    
    # Session metadata
    messages = models.JSONField(default=list, blank=True)
    session_rating = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    
    # Firebase integration
    firebase_doc_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Chat {self.session_id} - {self.patient.get_full_name()}"
    
    class Meta:
        verbose_name = "Chat Session"
        verbose_name_plural = "Chat Sessions"
        ordering = ['-updated_at']

class SystemSettings(models.Model):
    """System-wide settings"""
    SETTING_TYPES = [
        ('payment', 'Payment Settings'),
        ('notification', 'Notification Settings'),
        ('general', 'General Settings'),
        ('firebase', 'Firebase Settings'),
    ]
    
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField()
    setting_type = models.CharField(max_length=20, choices=SETTING_TYPES, default='general')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.key
    
    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"
        ordering = ['setting_type', 'key']
