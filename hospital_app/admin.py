"""
Django admin configuration for MAES Hospital Management System
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.html import format_html
from .models import (
    UserProfile, LabService, Appointment, TestResult, 
    PaymentTransaction, ChatSession, SystemSettings
)

# Unregister the default User admin
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    """Inline admin for user profile"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ('user_type', 'phone', 'date_of_birth', 'address', 'emergency_contact_name', 'emergency_contact_phone', 'is_active', 'notification_preference', 'firebase_uid', 'firebase_doc_id', 'created_at', 'updated_at')

class UserAdmin(BaseUserAdmin):
    """Extended user admin with profile"""
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_user_type', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'userprofile__user_type')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    
    def get_user_type(self, obj):
        try:
            return obj.userprofile.get_user_type_display()
        except UserProfile.DoesNotExist:
            return 'No Profile'
    get_user_type.short_description = 'User Type'

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'phone', 'created_at']
    list_filter = ['user_type', 'notification_preference', 'is_active']
    search_fields = ['user__username', 'user__email', 'phone']
    readonly_fields = ['firebase_uid', 'firebase_doc_id', 'created_at', 'updated_at']

@admin.register(LabService)
class LabServiceAdmin(admin.ModelAdmin):
    """Lab service admin"""
    list_display = ['name', 'code', 'category', 'price', 'duration_hours', 'is_active']
    list_filter = ['category', 'is_active', 'requires_fasting', 'priority_service']
    search_fields = ['name', 'code', 'description']
    ordering = ('category', 'name')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'code', 'description', 'category')
        }),
        ('Pricing & Duration', {
            'fields': ('price', 'duration_hours')
        }),
        ('Requirements', {
            'fields': ('preparation_instructions', 'requires_fasting', 'ai_analysis_available')
        }),
        ('Service Features', {
            'fields': ('is_active', 'is_walk_in_available', 'priority_service')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )

    readonly_fields = ['firebase_doc_id', 'created_at', 'updated_at']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    """Appointment admin"""
    list_display = ['appointment_id', 'patient', 'appointment_date', 'status', 'total_amount']
    list_filter = ['status', 'payment_method', 'payment_status', 'appointment_date']
    search_fields = ['patient__username', 'patient__email', 'appointment_id']
    date_hierarchy = 'appointment_date'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Patient Information', {
            'fields': ('patient', 'appointment_id')
        }),
        ('Appointment Details', {
            'fields': ('services', 'appointment_date', 'appointment_time', 'status', 'notes')
        }),
        ('Payment Information', {
            'fields': ('total_amount', 'payment_method', 'payment_status', 'payment_reference')
        }),
        ('System Information', {
            'fields': ('firebase_doc_id',),
            'classes': ('collapse',)
        }),
    )
    
    filter_horizontal = ['services']
    readonly_fields = ['appointment_id', 'firebase_doc_id', 'created_at', 'updated_at']

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    """Test result admin"""
    list_display = ['result_id', 'patient', 'service', 'status', 'created_at']
    list_filter = ['status', 'patient_notified', 'created_at']
    search_fields = ['patient__username', 'service__name', 'result_id']
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('result_id', 'appointment', 'patient', 'service', 'status')
        }),
        ('Results', {
            'fields': ('result_data', 'normal_ranges', 'ai_analysis')
        }),
        ('Review', {
            'fields': ('technician_notes', 'doctor_review', 'recommendations', 'reviewed_by')
        }),
        ('Files & Notifications', {
            'fields': ('result_pdf', 'patient_notified', 'notification_sent_at')
        }),
        ('System Information', {
            'fields': ('firebase_doc_id',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['result_id', 'firebase_doc_id', 'created_at', 'updated_at']

@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'patient', 'amount', 'payment_method', 'status']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['patient__username', 'transaction_id', 'payment_reference']
    readonly_fields = ['transaction_id', 'firebase_doc_id', 'created_at', 'updated_at']

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    """Chat session admin"""
    list_display = ['session_id', 'patient', 'session_type', 'is_active', 'created_at']
    list_filter = ['session_type', 'is_active', 'created_at']
    search_fields = ['patient__username', 'session_id']
    date_hierarchy = 'created_at'
    ordering = ('-updated_at',)
    
    fieldsets = (
        ('Session Information', {
            'fields': ('session_id', 'patient', 'session_type', 'is_active', 'admin_assigned')
        }),
        ('Messages & Feedback', {
            'fields': ('messages', 'session_rating', 'feedback')
        }),
        ('Firebase Integration', {
            'fields': ('firebase_doc_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'ended_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['session_id', 'firebase_doc_id', 'created_at', 'updated_at']

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    """System settings admin"""
    list_display = ['key', 'setting_type', 'is_active', 'updated_at']
    list_filter = ['setting_type', 'is_active']
    search_fields = ['key', 'description']
    ordering = ('key',)
    
    fieldsets = (
        ('Setting Information', {
            'fields': ('key', 'setting_type', 'description', 'is_active')
        }),
        ('Setting Value', {
            'fields': ('value',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['created_at', 'updated_at']

# Register the extended User admin
admin.site.register(User, UserAdmin)

# Customize admin site
admin.site.site_header = "MAES Laboratory Administration"
admin.site.site_title = "MAES Laboratory Admin"
admin.site.index_title = "Hospital Management System"
