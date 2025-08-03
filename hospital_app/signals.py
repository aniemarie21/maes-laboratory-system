from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.utils import timezone
from .models import UserProfile, Appointment, Payment, TestResult, AuditLog

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create UserProfile when User is created"""
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Save UserProfile when User is saved"""
    if hasattr(instance, 'userprofile'):
        instance.userprofile.save()

@receiver(post_save, sender=Appointment)
def appointment_status_changed(sender, instance, created, **kwargs):
    """Handle appointment status changes"""
    if created:
        # Create notification for new appointment
        from .models import Notification
        Notification.objects.create(
            user=instance.patient,
            notification_type='appointment_confirmed',
            title='Appointment Booked Successfully',
            message=f'Your appointment for {instance.service.name} has been scheduled for {instance.appointment_date.strftime("%B %d, %Y at %I:%M %p")}.',
            related_appointment=instance
        )

@receiver(post_save, sender=Payment)
def payment_received(sender, instance, created, **kwargs):
    """Handle payment notifications"""
    if created and instance.payment_status == 'completed':
        from .models import Notification
        Notification.objects.create(
            user=instance.appointment.patient,
            notification_type='payment_received',
            title='Payment Received',
            message=f'Your payment of ₱{instance.amount} for {instance.appointment.service.name} has been received.',
            related_appointment=instance.appointment
        )

@receiver(post_save, sender=TestResult)
def test_result_ready(sender, instance, created, **kwargs):
    """Notify when test results are ready"""
    if instance.status == 'released' and instance.released_at:
        from .models import Notification
        Notification.objects.create(
            user=instance.appointment.patient,
            notification_type='test_results_ready',
            title='Test Results Ready',
            message=f'Your test results for {instance.appointment.service.name} are now available.',
            related_appointment=instance.appointment
        )

# Audit logging signals
@receiver(post_save, sender=Appointment)
def log_appointment_changes(sender, instance, created, **kwargs):
    """Log appointment changes"""
    action = 'create' if created else 'update'
    AuditLog.objects.create(
        action=action,
        model_name='Appointment',
        object_id=str(instance.appointment_id),
        object_repr=str(instance),
        changes={'status': instance.status, 'payment_status': instance.payment_status}
    )

@receiver(post_save, sender=Payment)
def log_payment_changes(sender, instance, created, **kwargs):
    """Log payment changes"""
    action = 'create' if created else 'update'
    AuditLog.objects.create(
        action=action,
        model_name='Payment',
        object_id=str(instance.id),
        object_repr=str(instance),
        changes={'amount': str(instance.amount), 'status': instance.payment_status}
    )
