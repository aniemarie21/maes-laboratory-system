from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import os

def profile_picture_path(instance, filename):
    """Generate file path for profile pictures"""
    ext = filename.split('.')[-1]
    filename = f"{instance.user.username}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('profiles', filename)

def test_result_path(instance, filename):
    """Generate file path for test results"""
    ext = filename.split('.')[-1]
    filename = f"result_{instance.appointment.appointment_id}_{uuid.uuid4().hex[:8]}.{ext}"
    return os.path.join('test_results', filename)

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('admin', 'Administrator'),
        ('staff', 'Staff'),
        ('doctor', 'Doctor'),
        ('technician', 'Laboratory Technician'),
    ]
    
    NOTIFICATION_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('both', 'Email & SMS'),
        ('none', 'No Notifications'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to=profile_picture_path, blank=True, null=True)
    notification_preference = models.CharField(max_length=10, choices=NOTIFICATION_CHOICES, default='email')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_role_display()})"
    
    @property
    def full_name(self):
        return self.user.get_full_name() or self.user.username

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    head_doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_departments')
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        verbose_name = "Department"
        verbose_name_plural = "Departments"
    
    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='services')
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration_minutes = models.IntegerField(default=30, validators=[MinValueValidator(5), MaxValueValidator(480)])
    is_available = models.BooleanField(default=True)
    requires_fasting = models.BooleanField(default=False)
    requires_appointment = models.BooleanField(default=True)
    preparation_instructions = models.TextField(blank=True)
    sample_type = models.CharField(max_length=100, blank=True, help_text="e.g., Blood, Urine, Stool")
    normal_range = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['department__name', 'name']
        unique_together = ['name', 'department']
        verbose_name = "Service"
        verbose_name_plural = "Services"
    
    def __str__(self):
        return f"{self.name} - ₱{self.price}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('sample_collected', 'Sample Collected'),
        ('processing', 'Processing Results'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
        ('rescheduled', 'Rescheduled'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('partial', 'Partially Paid'),
        ('paid', 'Fully Paid'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Payment Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    appointment_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    patient_instructions = models.TextField(blank=True)
    assigned_technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_appointments')
    estimated_completion = models.DateTimeField(null=True, blank=True)
    actual_completion = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-appointment_date']
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"
    
    def save(self, *args, **kwargs):
        if not self.final_amount:
            self.final_amount = self.total_amount - self.discount_amount
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.patient.get_full_name()} - {self.service.name} ({self.appointment_date.strftime('%Y-%m-%d %H:%M')})"
    
    @property
    def is_overdue(self):
        return self.appointment_date < timezone.now() and self.status in ['pending', 'confirmed']

class TestResult(models.Model):
    RESULT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed'),
        ('released', 'Released to Patient'),
    ]
    
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='test_result')
    result_file = models.FileField(upload_to=test_result_path, blank=True, null=True)
    result_data = models.JSONField(blank=True, null=True, help_text="Structured test result data")
    result_text = models.TextField(blank=True, help_text="Text-based results")
    doctor_notes = models.TextField(blank=True)
    technician_notes = models.TextField(blank=True)
    is_normal = models.BooleanField(null=True, blank=True)
    abnormal_findings = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=RESULT_STATUS_CHOICES, default='pending')
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_results')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_results')
    released_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Test Result"
        verbose_name_plural = "Test Results"
    
    def __str__(self):
        return f"Results for {self.appointment}"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('gcash', 'GCash'),
        ('paymaya', 'PayMaya'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('hmo', 'HMO/Insurance'),
        ('cheque', 'Cheque'),
        ('installment', 'Installment'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    reference_number = models.CharField(max_length=100, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    verification_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)
    
    class Meta:
        ordering = ['-payment_date']
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
    
    def save(self, *args, **kwargs):
        if not self.receipt_number:
            self.receipt_number = f"RCP-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Payment ₱{self.amount} for {self.appointment.patient.get_full_name()}"

class MedicalCertificate(models.Model):
    CERTIFICATE_TYPES = [
        ('fitness', 'Medical Fitness Certificate'),
        ('sick_leave', 'Sick Leave Certificate'),
        ('work_clearance', 'Work Clearance Certificate'),
        ('travel', 'Travel Medical Certificate'),
        ('school', 'School Medical Certificate'),
        ('employment', 'Employment Medical Certificate'),
        ('insurance', 'Insurance Medical Certificate'),
    ]
    
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_certificates')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPES)
    purpose = models.CharField(max_length=200)
    medical_findings = models.TextField()
    recommendations = models.TextField(blank=True)
    restrictions = models.TextField(blank=True)
    valid_from = models.DateField()
    valid_until = models.DateField()
    issued_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issued_certificates')
    certificate_number = models.CharField(max_length=50, unique=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Medical Certificate"
        verbose_name_plural = "Medical Certificates"
    
    def save(self, *args, **kwargs):
        if not self.certificate_number:
            self.certificate_number = f"MAES-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Certificate {self.certificate_number} for {self.patient.get_full_name()}"

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('appointment_confirmed', 'Appointment Confirmed'),
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_cancelled', 'Appointment Cancelled'),
        ('test_results_ready', 'Test Results Ready'),
        ('payment_received', 'Payment Received'),
        ('payment_reminder', 'Payment Reminder'),
        ('certificate_ready', 'Certificate Ready'),
        ('system_update', 'System Update'),
        ('promotion', 'Promotion/Offer'),
        ('health_tip', 'Health Tip'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    related_appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
    
    def __str__(self):
        return f"{self.title} - {self.user.username}"
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('view', 'View'),
        ('export', 'Export'),
        ('import', 'Import'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=50)
    object_id = models.CharField(max_length=50, blank=True)
    object_repr = models.CharField(max_length=200, blank=True)
    changes = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    session_key = models.CharField(max_length=40, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Audit Log"
        verbose_name_plural = "Audit Logs"
    
    def __str__(self):
        return f"{self.user} - {self.get_action_display()} {self.model_name} - {self.timestamp}"

class SystemSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "System Setting"
        verbose_name_plural = "System Settings"
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}"
