"""
Forms for MAES Hospital Management System
Online payment and appointment system for walk-in patients
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import (
    UserProfile, Appointment, LabService, MedicalCertificate, 
    PaymentTransaction
)
from datetime import datetime, timedelta, date, time

class PatientRegistrationForm(UserCreationForm):
    """Patient registration form for online system"""
    first_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'First Name',
            'required': True
        })
    )
    last_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Last Name',
            'required': True
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email Address',
            'required': True
        })
    )
    phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Phone Number (for SMS notifications)',
            'required': True
        })
    )
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'required': True
        })
    )
    address = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Complete Address',
            'rows': 3,
            'required': True
        })
    )
    emergency_contact_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Emergency Contact Name',
            'required': True
        })
    )
    emergency_contact_phone = forms.CharField(
        max_length=20,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Emergency Contact Phone',
            'required': True
        })
    )
    notification_preference = forms.ChoiceField(
        choices=[('email', 'Email'), ('sms', 'SMS'), ('both', 'Both Email and SMS')],
        widget=forms.Select(attrs={'class': 'form-control'}),
        initial='both',
        help_text='How would you like to receive appointment and result notifications?'
    )
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Username'
            }),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Password'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'form-control',
            'placeholder': 'Confirm Password'
        })
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        
        if commit:
            user.save()
            # Create user profile
            UserProfile.objects.create(
                user=user,
                user_type='patient',
                phone=self.cleaned_data['phone'],
                date_of_birth=self.cleaned_data['date_of_birth'],
                address=self.cleaned_data['address'],
                emergency_contact_name=self.cleaned_data['emergency_contact_name'],
                emergency_contact_phone=self.cleaned_data['emergency_contact_phone'],
                notification_preference=self.cleaned_data['notification_preference'],
            )
        
        return user

class AppointmentBookingForm(forms.ModelForm):
    """Online appointment booking form with payment options"""
    services = forms.ModelMultipleChoiceField(
        queryset=LabService.objects.filter(is_active=True, is_walk_in_available=True),
        widget=forms.CheckboxSelectMultiple(attrs={
            'class': 'form-check-input'
        }),
        required=True,
        help_text='Select the laboratory services you need'
    )
    
    preferred_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'min': (date.today() + timedelta(days=1)).strftime('%Y-%m-%d')
        }),
        help_text='Choose your preferred walk-in date (tomorrow onwards)'
    )
    
    preferred_time = forms.TimeField(
        widget=forms.TimeInput(attrs={
            'class': 'form-control',
            'type': 'time'
        }),
        help_text='Choose your preferred walk-in time'
    )
    
    payment_method = forms.ChoiceField(
        choices=Appointment.PAYMENT_METHODS,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        help_text='Choose your payment method'
    )
    
    financial_assistance = forms.ChoiceField(
        choices=Appointment.FINANCIAL_ASSISTANCE,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        initial='none',
        help_text='Select if you qualify for any discounts or assistance'
    )
    
    # HMO/Insurance fields
    hmo_provider = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'HMO Provider Name (e.g., Maxicare, Medicard)'
        })
    )
    
    hmo_card_number = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'HMO Card Number'
        })
    )
    
    # Guarantee letter upload
    guarantee_letter = forms.FileField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': '.pdf,.jpg,.jpeg,.png'
        }),
        help_text='Upload company guarantee letter (PDF, JPG, PNG)'
    )
    
    notes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Additional notes, special instructions, or medical conditions',
            'rows': 3
        })
    )
    
    # Terms and conditions
    terms_accepted = forms.BooleanField(
        required=True,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        }),
        label='I agree to the terms and conditions and payment policy'
    )
    
    class Meta:
        model = Appointment
        fields = [
            'preferred_date', 'preferred_time', 'payment_method', 
            'financial_assistance', 'hmo_provider', 'hmo_card_number',
            'guarantee_letter', 'notes'
        ]
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Set minimum date to tomorrow
        tomorrow = date.today() + timedelta(days=1)
        self.fields['preferred_date'].widget.attrs['min'] = tomorrow.strftime('%Y-%m-%d')
        
        # Set time constraints based on day of week
        self.fields['preferred_time'].help_text = (
            'Operating Hours: Mon-Fri (6AM-8PM), Sat (7AM-6PM), Sun (8AM-4PM)'
        )
    
    def clean_preferred_date(self):
        preferred_date = self.cleaned_data['preferred_date']
        
        # Check if date is in the future
        if preferred_date <= date.today():
            raise forms.ValidationError("Please select a future date (tomorrow onwards).")
        
        # Check if date is not too far in the future (max 30 days)
        max_date = date.today() + timedelta(days=30)
        if preferred_date > max_date:
            raise forms.ValidationError("Appointments can only be booked up to 30 days in advance.")
        
        return preferred_date
    
    def clean_preferred_time(self):
        preferred_time = self.cleaned_data['preferred_time']
        preferred_date = self.cleaned_data.get('preferred_date')
        
        if preferred_date:
            weekday = preferred_date.weekday()
            
            # Check operating hours based on day of week
            if weekday < 5:  # Monday to Friday
                if preferred_time < time(6, 0) or preferred_time > time(20, 0):
                    raise forms.ValidationError("Weekday appointments: 6:00 AM - 8:00 PM")
            elif weekday == 5:  # Saturday
                if preferred_time < time(7, 0) or preferred_time > time(18, 0):
                    raise forms.ValidationError("Saturday appointments: 7:00 AM - 6:00 PM")
            elif weekday == 6:  # Sunday
                if preferred_time < time(8, 0) or preferred_time > time(16, 0):
                    raise forms.ValidationError("Sunday appointments: 8:00 AM - 4:00 PM")
        
        return preferred_time
    
    def clean(self):
        cleaned_data = super().clean()
        financial_assistance = cleaned_data.get('financial_assistance')
        hmo_provider = cleaned_data.get('hmo_provider')
        hmo_card_number = cleaned_data.get('hmo_card_number')
        guarantee_letter = cleaned_data.get('guarantee_letter')
        
        # Validate HMO fields
        if financial_assistance == 'hmo':
            if not hmo_provider:
                raise forms.ValidationError("HMO provider name is required for HMO assistance.")
            if not hmo_card_number:
                raise forms.ValidationError("HMO card number is required for HMO assistance.")
        
        # Validate guarantee letter
        if financial_assistance == 'guarantee_letter':
            if not guarantee_letter:
                raise forms.ValidationError("Guarantee letter file is required for company guarantee.")
        
        return cleaned_data

class PaymentForm(forms.Form):
    """Payment form for online transactions"""
    payment_method = forms.ChoiceField(
        choices=Appointment.PAYMENT_METHODS,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        help_text='Select your payment method'
    )
    
    payment_reference = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Transaction/Reference Number'
        }),
        help_text='Enter transaction number for GCash, PayMaya, or Bank Transfer'
    )
    
    payment_screenshot = forms.ImageField(
        required=False,
        widget=forms.FileInput(attrs={
            'class': 'form-control',
            'accept': 'image/*'
        }),
        help_text='Upload payment screenshot for verification (JPG, PNG)'
    )
    
    sender_name = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Name of sender/account holder'
        }),
        help_text='Name used in the payment transaction'
    )
    
    payment_date = forms.DateTimeField(
        required=False,
        widget=forms.DateTimeInput(attrs={
            'class': 'form-control',
            'type': 'datetime-local'
        }),
        help_text='Date and time of payment'
    )
    
    notes = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Additional payment notes or instructions',
            'rows': 3
        })
    )
    
    def clean(self):
        cleaned_data = super().clean()
        payment_method = cleaned_data.get('payment_method')
        payment_reference = cleaned_data.get('payment_reference')
        payment_screenshot = cleaned_data.get('payment_screenshot')
        
        # Require reference number for digital payments
        if payment_method in ['gcash', 'paymaya', 'bank_transfer'] and not payment_reference:
            raise forms.ValidationError(f"Reference number is required for {payment_method} payments.")
        
        # Require screenshot for verification
        if payment_method != 'cash_on_arrival' and not payment_screenshot:
            raise forms.ValidationError("Payment screenshot is required for verification.")
        
        return cleaned_data

class MedicalCertificateForm(forms.ModelForm):
    """Medical certificate request form with online payment"""
    certificate_type = forms.ChoiceField(
        choices=MedicalCertificate.CERTIFICATE_TYPES,
        widget=forms.Select(attrs={
            'class': 'form-control'
        }),
        help_text='Select the type of medical certificate you need'
    )
    
    purpose = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Please provide detailed purpose of the medical certificate',
            'rows': 4
        }),
        help_text='Detailed explanation of why you need this certificate'
    )
    
    employer_name = forms.CharField(
        max_length=200,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Company/Institution Name'
        }),
        help_text='Name of employer or institution (if applicable)'
    )
    
    employer_address = forms.CharField(
        required=False,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Complete address of company/institution',
            'rows': 3
        }),
        help_text='Complete address where certificate will be submitted'
    )
    
    rush_processing = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        }),
        label='Rush Processing (+₱100) - Ready in 2-4 hours',
        help_text='Check if you need the certificate urgently'
    )
    
    preferred_pickup_date = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date',
            'min': date.today().strftime('%Y-%m-%d')
        }),
        help_text='When do you plan to pick up the certificate?'
    )
    
    contact_for_updates = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Phone number for updates'
        }),
        help_text='Phone number for certificate status updates'
    )
    
    class Meta:
        model = MedicalCertificate
        fields = [
            'certificate_type', 'purpose', 'employer_name', 
            'employer_address', 'rush_processing'
        ]
    
    def clean_preferred_pickup_date(self):
        pickup_date = self.cleaned_data.get('preferred_pickup_date')
        rush_processing = self.cleaned_data.get('rush_processing')
        
        if pickup_date:
            if pickup_date < date.today():
                raise forms.ValidationError("Pickup date cannot be in the past.")
            
            # Check minimum processing time
            min_date = date.today() + timedelta(days=1)
            if rush_processing:
                min_date = date.today()  # Same day for rush processing
            
            if pickup_date < min_date:
                if rush_processing:
                    raise forms.ValidationError("Rush processing allows same-day pickup.")
                else:
                    raise forms.ValidationError("Regular processing requires at least 1 day.")
        
        return pickup_date

class ContactForm(forms.Form):
    """Contact form for inquiries"""
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your Full Name'
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your Email Address'
        })
    )
    phone = forms.CharField(
        max_length=20,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Your Phone Number'
        })
    )
    subject = forms.ChoiceField(
        choices=[
            ('general', 'General Inquiry'),
            ('appointment', 'Appointment Support'),
            ('payment', 'Payment Issues'),
            ('technical', 'Technical Support'),
            ('complaint', 'Complaint/Feedback'),
        ],
        widget=forms.Select(attrs={
            'class': 'form-control'
        })
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Your Message',
            'rows': 5
        })
    )
    
    # Optional fields for specific inquiries
    appointment_id = forms.CharField(
        max_length=50,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Appointment ID (if applicable)'
        })
    )
    
    payment_reference = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Payment Reference Number (if applicable)'
        })
    )

class LoginForm(forms.Form):
    """Custom login form"""
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Username or Email'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Password'
        })
    )
    remember_me = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={
            'class': 'form-check-input'
        }),
        label='Keep me logged in'
    )

class PasswordResetForm(forms.Form):
    """Password reset form"""
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your email address'
        }),
        help_text='We will send password reset instructions to this email'
    )

class ProfileUpdateForm(forms.ModelForm):
    """Profile update form"""
    first_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    last_name = forms.CharField(
        max_length=30,
        widget=forms.TextInput(attrs={'class': 'form-control'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'class': 'form-control'})
    )
    
    class Meta:
        model = UserProfile
        fields = [
            'phone', 'date_of_birth', 'address', 
            'emergency_contact_name', 'emergency_contact_phone',
            'notification_preference'
        ]
        widgets = {
            'phone': forms.TextInput(attrs={'class': 'form-control'}),
            'date_of_birth': forms.DateInput(attrs={'class': 'form-control', 'type': 'date'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
            'emergency_contact_name': forms.TextInput(attrs={'class': 'form-control'}),
            'emergency_contact_phone': forms.TextInput(attrs={'class': 'form-control'}),
            'notification_preference': forms.Select(attrs={'class': 'form-control'}),
        }
