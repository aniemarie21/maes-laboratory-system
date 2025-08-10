from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
import uuid
import os

def user_profile_picture_path(instance, filename):
    """Generate file path for user profile pictures"""
    ext = filename.split('.')[-1]
    filename = f'{instance.user.username}_profile.{ext}'
    return os.path.join('profile_pictures', filename)

def test_result_file_path(instance, filename):
    """Generate file path for test result files"""
    ext = filename.split('.')[-1]
    filename = f'{instance.appointment.appointment_id}_result.{ext}'
    return os.path.join('test_results', filename)

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('technician', 'Technician'),
        ('admin', 'Administrator'),
        ('receptionist', 'Receptionist'),
    ]
    
    NOTIFICATION_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('both', 'Email & SMS'),
        ('none', 'None'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")],
        blank=True
    )
    address = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to=user_profile_picture_path, blank=True, null=True)
    notification_preference = models.CharField(max_length=10, choices=NOTIFICATION_CHOICES, default='email')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Firebase integration fields
    firebase_uid = models.CharField(max_length=128, blank=True, null=True, unique=True)
    google_id = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'user_profiles'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
    
    def __str__(self):
        return f"{self.user.get_full_name()} ({self.get_role_display()})"
    
    def get_full_name(self):
        return self.user.get_full_name() or self.user.username

# Signal to create UserProfile when User is created
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    head_doctor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='headed_departments')
    phone_number = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'departments'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Service(models.Model):
    SAMPLE_TYPE_CHOICES = [
        ('blood', 'Blood'),
        ('urine', 'Urine'),
        ('stool', 'Stool'),
        ('saliva', 'Saliva'),
        ('tissue', 'Tissue'),
        ('imaging', 'Imaging'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='services')
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    duration_minutes = models.PositiveIntegerField(default=30)
    sample_type = models.CharField(max_length=20, choices=SAMPLE_TYPE_CHOICES, default='blood')
    requires_fasting = models.BooleanField(default=False)
    requires_appointment = models.BooleanField(default=True)
    preparation_instructions = models.TextField(blank=True)
    normal_range = models.CharField(max_length=200, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'services'
        ordering = ['department__name', 'name']
        unique_together = ['name', 'department']
    
    def __str__(self):
        return f"{self.name} - {self.department.name}"

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    appointment_id = models.CharField(max_length=20, unique=True, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='normal')
    
    # Pricing
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    final_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Assignment and timing
    assigned_technician = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_appointments')
    estimated_completion = models.DateTimeField(null=True, blank=True)
    actual_completion = models.DateTimeField(null=True, blank=True)
    
    # Notes and instructions
    notes = models.TextField(blank=True)
    patient_instructions = models.TextField(blank=True)
    
    # Financial assistance
    financial_assistance_type = models.CharField(max_length=50, blank=True)
    insurance_details = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'appointments'
        ordering = ['-appointment_date']
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:
            # Generate unique appointment ID
            prefix = 'APT'
            timestamp = timezone.now().strftime('%Y%m%d')
            count = Appointment.objects.filter(created_at__date=timezone.now().date()).count() + 1
            self.appointment_id = f"{prefix}{timestamp}{count:04d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.appointment_id} - {self.patient.get_full_name()} - {self.service.name}"

class TestResult(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('reviewed', 'Reviewed'),
        ('released', 'Released'),
    ]
    
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='test_result')
    result_file = models.FileField(upload_to=test_result_file_path, blank=True, null=True)
    result_text = models.TextField(blank=True)
    result_data = models.JSONField(default=dict, blank=True)
    
    # Analysis
    is_normal = models.BooleanField(default=True)
    abnormal_findings = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    
    # Processing information
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='processed_results')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_results')
    released_at = models.DateTimeField(null=True, blank=True)
    
    # Notes
    technician_notes = models.TextField(blank=True)
    doctor_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'test_results'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Result for {self.appointment.appointment_id}"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('cash', 'Cash'),
        ('gcash', 'GCash'),
        ('paymaya', 'PayMaya'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('check', 'Check'),
        ('hmo', 'HMO'),
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
    
    receipt_number = models.CharField(max_length=20, unique=True, editable=False)
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    
    # Payment details
    reference_number = models.CharField(max_length=100, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)
    
    # Verification
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_payments')
    verified_at = models.DateTimeField(null=True, blank=True)
    
    # Additional information
    notes = models.TextField(blank=True)
    receipt_image = models.ImageField(upload_to='payment_receipts/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-payment_date']
    
    def save(self, *args, **kwargs):
        if not self.receipt_number:
            # Generate unique receipt number
            prefix = 'RCP'
            timestamp = timezone.now().strftime('%Y%m%d')
            count = Payment.objects.filter(created_at__date=timezone.now().date()).count() + 1
            self.receipt_number = f"{prefix}{timestamp}{count:04d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.receipt_number} - ₱{self.amount}"

class MedicalCertificate(models.Model):
    CERTIFICATE_TYPE_CHOICES = [
        ('fitness', 'Medical Fitness Certificate'),
        ('sick_leave', 'Sick Leave Certificate'),
        ('work_clearance', 'Work Clearance Certificate'),
        ('travel', 'Travel Medical Certificate'),
        ('school', 'School Medical Certificate'),
        ('employment', 'Employment Medical Certificate'),
        ('insurance', 'Insurance Medical Certificate'),
        ('disability', 'Disability Certificate'),
        ('vaccination', 'Vaccination Certificate'),
        ('other', 'Other'),
    ]
    
    certificate_number = models.CharField(max_length=20, unique=True, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_certificates')
    certificate_type = models.CharField(max_length=20, choices=CERTIFICATE_TYPE_CHOICES)
    purpose = models.CharField(max_length=200)
    
    # Certificate details
    diagnosis = models.TextField(blank=True)
    recommendations = models.TextField(blank=True)
    restrictions = models.TextField(blank=True)
    
    # Validity
    valid_from = models.DateField()
    valid_until = models.DateField(null=True, blank=True)
    
    # Issuance
    issued_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='issued_certificates')
    issued_date = models.DateTimeField(auto_now_add=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # File
    certificate_file = models.FileField(upload_to='medical_certificates/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medical_certificates'
        ordering = ['-issued_date']
    
    def save(self, *args, **kwargs):
        if not self.certificate_number:
            # Generate unique certificate number
            prefix = 'MED'
            timestamp = timezone.now().strftime('%Y%m%d')
            count = MedicalCertificate.objects.filter(created_at__date=timezone.now().date()).count() + 1
            self.certificate_number = f"{prefix}{timestamp}{count:04d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.certificate_number} - {self.get_certificate_type_display()}"

class Notification(models.Model):
    NOTIFICATION_TYPE_CHOICES = [
        ('appointment_confirmed', 'Appointment Confirmed'),
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_cancelled', 'Appointment Cancelled'),
        ('result_ready', 'Test Result Ready'),
        ('payment_received', 'Payment Received'),
        ('certificate_ready', 'Certificate Ready'),
        ('system_update', 'System Update'),
        ('promotional', 'Promotional'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Related objects
    related_appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    related_payment = models.ForeignKey(Payment, on_delete=models.CASCADE, null=True, blank=True)
    related_certificate = models.ForeignKey(MedicalCertificate, on_delete=models.CASCADE, null=True, blank=True)
    
    # Status
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
    
    def mark_as_read(self):
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save()
    
    def __str__(self):
        return f"{self.title} - {self.user.get_full_name()}"

class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('view', 'View'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('export', 'Export'),
        ('import', 'Import'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    model_name = models.CharField(max_length=100)
    object_id = models.CharField(max_length=100, blank=True)
    object_repr = models.CharField(max_length=200, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    
    # Request information
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    session_key = models.CharField(max_length=40, blank=True)
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.model_name} - {self.timestamp}"

class SystemSettings(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'system_settings'
        verbose_name = 'System Setting'
        verbose_name_plural = 'System Settings'
    
    def __str__(self):
        return f"{self.key}: {self.value[:50]}"

class ChatbotConversation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100)
    message = models.TextField()
    response = models.TextField()
    is_helpful = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chatbot_conversations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Chat - {self.session_id} - {self.created_at}"
