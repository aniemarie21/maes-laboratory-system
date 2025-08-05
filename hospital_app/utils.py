from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.http import HttpResponse
import csv
import json
from io import BytesIO
import xlsxwriter

class ReportExporter:
    def __init__(self):
        pass
    
    def export_appointments_csv(self, appointments):
        """Export appointments to CSV"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="appointments_report.csv"'
        
        writer = csv.writer(response)
        writer.writerow([
            'Appointment ID', 'Patient Name', 'Service', 'Date', 'Time',
            'Status', 'Payment Status', 'Amount', 'Notes'
        ])
        
        for appointment in appointments:
            writer.writerow([
                str(appointment.appointment_id),
                appointment.patient.get_full_name(),
                appointment.service.name,
                appointment.appointment_date.strftime('%Y-%m-%d'),
                appointment.appointment_date.strftime('%H:%M'),
                appointment.get_status_display(),
                appointment.get_payment_status_display(),
                f"₱{appointment.final_amount}",
                appointment.notes or 'N/A'
            ])
        
        return response
    
    def export_appointments_excel(self, appointments):
        """Export appointments to Excel"""
        output = BytesIO()
        
        workbook = xlsxwriter.Workbook(output)
        worksheet = workbook.add_worksheet('Appointments Report')
        
        # Add header format
        header_format = workbook.add_format({
            'bold': True,
            'bg_color': '#4472C4',
            'font_color': 'white',
            'align': 'center',
            'valign': 'vcenter',
            'border': 1
        })
        
        # Add data format
        data_format = workbook.add_format({
            'border': 1,
            'align': 'left',
            'valign': 'vcenter'
        })
        
        # Write headers
        headers = [
            'Appointment ID', 'Patient Name', 'Service', 'Date', 'Time',
            'Status', 'Payment Status', 'Amount', 'Notes'
        ]
        
        for col, header in enumerate(headers):
            worksheet.write(0, col, header, header_format)
        
        # Write data
        for row, appointment in enumerate(appointments, start=1):
            worksheet.write(row, 0, str(appointment.appointment_id), data_format)
            worksheet.write(row, 1, appointment.patient.get_full_name(), data_format)
            worksheet.write(row, 2, appointment.service.name, data_format)
            worksheet.write(row, 3, appointment.appointment_date.strftime('%Y-%m-%d'), data_format)
            worksheet.write(row, 4, appointment.appointment_date.strftime('%H:%M'), data_format)
            worksheet.write(row, 5, appointment.get_status_display(), data_format)
            worksheet.write(row, 6, appointment.get_payment_status_display(), data_format)
            worksheet.write(row, 7, f"₱{appointment.final_amount}", data_format)
            worksheet.write(row, 8, appointment.notes or 'N/A', data_format)
        
        # Adjust column widths
        worksheet.set_column('A:A', 20)
        worksheet.set_column('B:B', 25)
        worksheet.set_column('C:C', 30)
        worksheet.set_column('D:D', 12)
        worksheet.set_column('E:E', 10)
        worksheet.set_column('F:F', 15)
        worksheet.set_column('G:G', 15)
        worksheet.set_column('H:H', 12)
        worksheet.set_column('I:I', 20)
        
        workbook.close()
        output.seek(0)
        
        response = HttpResponse(
            output.read(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="appointments_report.xlsx"'
        
        return response

class NotificationService:
    def __init__(self):
        pass
    
    def send_email_notification(self, user, subject, template, context):
        """Send email notification to user"""
        try:
            html_message = render_to_string(template, context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def send_sms_notification(self, phone_number, message):
        """Send SMS notification (placeholder implementation)"""
        # This would integrate with SMS service provider
        # For now, just log the message
        print(f"SMS to {phone_number}: {message}")
        return True

class SecurityHelper:
    def __init__(self):
        pass
    
    def secure_payment_data(self, payment_data):
        """Secure payment data by masking sensitive information"""
        if 'card_number' in payment_data:
            card_number = payment_data['card_number']
            if len(card_number) > 4:
                payment_data['card_number'] = '*' * (len(card_number) - 4) + card_number[-4:]
        
        if 'account_number' in payment_data:
            account_number = payment_data['account_number']
            if len(account_number) > 4:
                payment_data['account_number'] = '*' * (len(account_number) - 4) + account_number[-4:]
        
        return payment_data
    
    def validate_payment_reference(self, reference_number, payment_method):
        """Validate payment reference number format"""
        if payment_method == 'gcash':
            return len(reference_number) >= 10
        elif payment_method == 'paymaya':
            return len(reference_number) >= 8
        elif payment_method == 'bank_transfer':
            return len(reference_number) >= 6
        else:
            return True

def get_admin_email():
    """Get admin email (hidden from public view)"""
    return getattr(settings, 'ADMIN_EMAIL', 'admin@maeslaboratory.com')
