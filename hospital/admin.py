from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Department, Service, Appointment, TestResult, Payment

# Unregister the default User admin
admin.site.unregister(User)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_active')
    
    def get_role(self, obj):
        try:
            return obj.userprofile.get_role_display()
        except UserProfile.DoesNotExist:
            return 'No Profile'
    get_role.short_description = 'Role'

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name']

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'department', 'price', 'duration_minutes', 'is_available']
    list_filter = ['department', 'is_available']
    search_fields = ['name', 'description']

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['appointment_id', 'patient', 'service', 'appointment_date', 'status']
    list_filter = ['status', 'appointment_date']
    search_fields = ['patient__username', 'service__name']
    readonly_fields = ['appointment_id']

@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'is_normal', 'released_at', 'created_at']
    list_filter = ['is_normal', 'released_at']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'amount', 'payment_method', 'is_verified', 'payment_date']
    list_filter = ['payment_method', 'is_verified', 'payment_date']

# Customize admin site
admin.site.site_header = "MAES Laboratory Administration"
admin.site.site_title = "MAES Lab Admin"
admin.site.index_title = "Welcome to MAES Laboratory Management"
