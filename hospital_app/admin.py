from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import (
    UserProfile, Department, Service, Appointment, 
    TestResult, Payment, MedicalCertificate, Notification, 
    AuditLog, SystemSettings
)

# Unregister the default User admin
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ('role', 'phone_number', 'address', 'date_of_birth', 'emergency_contact', 'emergency_phone', 'notification_preference', 'profile_picture', 'is_active')

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'get_phone', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'userprofile__role', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'userprofile__phone_number')
    
    def get_role(self, obj):
        try:
            return obj.userprofile.get_role_display()
        except UserProfile.DoesNotExist:
            return 'No Profile'
    get_role.short_description = 'Role'
    
    def get_phone(self, obj):
        try:
            return obj.userprofile.phone_number
        except UserProfile.DoesNotExist:
            return '-'
    get_phone.short_description = 'Phone'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone_number', 'notification_preference', 'is_active', 'created_at']
    list_filter = ['role', 'notification_preference', 'is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone_number', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('User Information', {
            'fields': ('user', 'role')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'address', 'emergency_contact', 'emergency_phone')
        }),
        ('Personal Information', {
            'fields': ('date_of_birth', 'profile_picture')
        }),
        ('Preferences', {
            'fields': ('notification_preference', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'head_doctor', 'phone_number', 'email', 'service_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description', 'head_doctor__username']
    readonly_fields = ['created_at', 'updated_at']
    
    def service_count(self, obj):
        return obj.services.count()
    service_count.short_description = 'Services'

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'price', 'duration_minutes', 'requires_fasting', 'is_available', 'created_at']
    list_filter = ['department', 'is_available', 'requires_fasting', 'requires_appointment', 'created_at']
    search_fields = ['name', 'description', 'department__name']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'department', 'description')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'duration_minutes')
        }),
        ('Requirements', {
            'fields': ('requires_fasting', 'requires_appointment', 'preparation_instructions')
        }),
        ('Technical Details', {
            'fields': ('sample_type', 'normal_range')
        }),
        ('Status', {
            'fields': ('is_available',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['appointment_id', 'patient_name', 'service', 'appointment_date', 'status', 'payment_status', 'priority', 'final_amount']
    list_filter = ['status', 'payment_status', 'priority', 'appointment_date', 'created_at']
    search_fields = ['patient__username', 'patient__first_name', 'patient__last_name', 'service__name', 'appointment_id']
    readonly_fields = ['appointment_id', 'created_at', 'updated_at']
    date_hierarchy = 'appointment_date'
    actions = ['mark_as_confirmed', 'mark_as_completed', 'mark_as_cancelled']
    
    fieldsets = (
        ('Appointment Details', {
            'fields': ('appointment_id', 'patient', 'service', 'appointment_date')
        }),
        ('Status & Priority', {
            'fields': ('status', 'payment_status', 'priority')
        }),
        ('Financial Information', {
            'fields': ('total_amount', 'discount_amount', 'final_amount')
        }),
        ('Assignment', {
            'fields': ('assigned_technician', 'estimated_completion', 'actual_completion')
        }),
        ('Notes', {
            'fields': ('notes', 'patient_instructions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def patient_name(self, obj):
        return obj.patient.get_full_name() or obj.patient.username
    patient_name.short_description = 'Patient'
    
    def mark_as_confirmed(self, request, queryset):
        queryset.update(status='confirmed')
        self.message_user(request, f"{queryset.count()} appointments marked as confirmed.")
    mark_as_confirmed.short_description = "Mark selected appointments as confirmed"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')
        self.message_user(request, f"{queryset.count()} appointments marked as completed.")
    mark_as_completed.short_description = "Mark selected appointments as completed"
    
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
        self.message_user(request, f"{queryset.count()} appointments marked as cancelled.")
    mark_as_cancelled.short_description = "Mark selected appointments as cancelled"

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'status', 'is_normal', 'processed_by', 'reviewed_by', 'released_at', 'created_at']
    list_filter = ['status', 'is_normal', 'released_at', 'created_at']
    search_fields = ['appointment__patient__username', 'appointment__service__name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Appointment Information', {
            'fields': ('appointment',)
        }),
        ('Results', {
            'fields': ('result_file', 'result_text', 'result_data')
        }),
        ('Analysis', {
            'fields': ('is_normal', 'abnormal_findings', 'recommendations')
        }),
        ('Notes', {
            'fields': ('technician_notes', 'doctor_notes')
        }),
        ('Processing', {
            'fields': ('status', 'processed_by', 'reviewed_by', 'released_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'appointment', 'amount', 'payment_method', 'payment_status', 'is_verified', 'payment_date']
    list_filter = ['payment_method', 'payment_status', 'is_verified', 'payment_date']
    search_fields = ['appointment__patient__username', 'reference_number', 'transaction_id', 'receipt_number']
    readonly_fields = ['receipt_number', 'payment_date']
    actions = ['mark_as_verified', 'mark_as_completed']
    
    def mark_as_verified(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} payments marked as verified.")
    mark_as_verified.short_description = "Mark selected payments as verified"
    
    def mark_as_completed(self, request, queryset):
        queryset.update(payment_status='completed')
        self.message_user(request, f"{queryset.count()} payments marked as completed.")
    mark_as_completed.short_description = "Mark selected payments as completed"

@admin.register(MedicalCertificate)
class MedicalCertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_number', 'patient', 'certificate_type', 'valid_from', 'valid_until', 'issued_by', 'is_active']
    list_filter = ['certificate_type', 'is_active', 'created_at', 'valid_from']
    search_fields = ['certificate_number', 'patient__username', 'patient__first_name', 'patient__last_name']
    readonly_fields = ['certificate_number', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'is_sent', 'created_at']
    list_filter = ['notification_type', 'is_read', 'is_sent', 'created_at']
    search_fields = ['title', 'message', 'user__username']
    readonly_fields = ['created_at', 'sent_at', 'read_at']
    actions = ['mark_as_read', 'mark_as_sent']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(request, f"{queryset.count()} notifications marked as read.")
    mark_as_read.short_description = "Mark selected notifications as read"
    
    def mark_as_sent(self, request, queryset):
        queryset.update(is_sent=True)
        self.message_user(request, f"{queryset.count()} notifications marked as sent.")
    mark_as_sent.short_description = "Mark selected notifications as sent"

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['timestamp', 'user', 'action', 'model_name', 'object_repr', 'ip_address']
    list_filter = ['action', 'model_name', 'timestamp']
    search_fields = ['user__username', 'model_name', 'object_repr', 'ip_address']
    readonly_fields = ['user', 'action', 'model_name', 'object_id', 'object_repr', 'changes', 'ip_address', 'user_agent', 'session_key', 'timestamp']
    date_hierarchy = 'timestamp'
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ['key', 'value_preview', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['key', 'value', 'description']
    readonly_fields = ['created_at', 'updated_at']
    
    def value_preview(self, obj):
        return obj.value[:100] + '...' if len(obj.value) > 100 else obj.value
    value_preview.short_description = 'Value'

# Customize admin site
admin.site.site_header = "MAES Laboratory Management System"
admin.site.site_title = "MAES Lab Admin"
admin.site.index_title = "Welcome to MAES Laboratory Administration"
