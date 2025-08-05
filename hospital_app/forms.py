from django import forms
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from django.contrib.auth.models import User
from .models import UserProfile, Appointment, MedicalCertificate

class FinancialAssistanceForm(forms.Form):
    ASSISTANCE_CHOICES = [
        ('none', 'No Financial Assistance'),
        ('hmo', 'HMO/Insurance'),
        ('senior', 'Senior Citizen Discount (20%)'),
        ('pwd', 'PWD Discount (20%)'),
        ('student', 'Student Discount (10%)'),
        ('government', 'Government Employee'),
        ('installment', 'Installment Payment'),
    ]
    
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('gcash', 'GCash'),
        ('paymaya', 'PayMaya'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('cheque', 'Cheque'),
    ]
    
    financial_assistance_type = forms.ChoiceField(
        choices=ASSISTANCE_CHOICES,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    hmo_provider = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'HMO Provider Name'})
    )
    
    hmo_card_number = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'HMO Card Number'})
    )
    
    preferred_payment_method = forms.ChoiceField(
        choices=PAYMENT_METHODS,
        widget=forms.Select(attrs={'class': 'form-select'})
    )
    
    gcash_number = forms.CharField(
        max_length=15,
        required=False,
        widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'GCash Number'})
    )
    
    installment_months = forms.IntegerField(
        min_value=2,
        max_value=12,
        required=False,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Number of months'})
    )
    
    guarantee_letter = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-control', 'accept': '.pdf,.jpg,.jpeg,.png'})
    )
    
    additional_documents = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={'class': 'form-control', 'accept': '.pdf,.jpg,.jpeg,.png', 'multiple': True})
    )

class MedicalCertificateRequestForm(forms.ModelForm):
    class Meta:
        model = MedicalCertificate
        fields = ['certificate_type', 'purpose', 'valid_from', 'valid_until']
        widgets = {
            'certificate_type': forms.Select(attrs={'class': 'form-select'}),
            'purpose': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Purpose of certificate'}),
            'valid_from': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'valid_until': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
        }

class NotificationPreferencesForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['notification_preference']
        widgets = {
            'notification_preference': forms.Select(attrs={'class': 'form-select'})
        }

class CustomPasswordResetForm(PasswordResetForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Enter your email address'
        })

class CustomSetPasswordForm(SetPasswordForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({'class': 'form-control'})
