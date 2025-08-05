from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

class ChatbotService:
    def __init__(self):
        self.responses = {
            # Greetings
            'hello': 'Hello! Welcome to MAES Laboratory. How can I assist you today?',
            'hi': 'Hi there! I\'m here to help you with any questions about our laboratory services.',
            'good morning': 'Good morning! How can I help you today?',
            'good afternoon': 'Good afternoon! What can I do for you?',
            'good evening': 'Good evening! How may I assist you?',
            
            # Services and Appointments
            'services': 'We offer comprehensive laboratory services including blood tests, X-rays, ultrasound, ECG, microscopy, and genetic testing. Would you like details about any specific service?',
            'blood test': 'Our blood tests include complete blood count (₱350), lipid profile, blood sugar, liver function, and kidney function tests.',
            'xray': 'We provide digital X-ray services for chest, bone, and joint examinations. Price: ₱500, Duration: 15 minutes.',
            'ultrasound': 'High-resolution ultrasound imaging for abdominal, pelvic, and cardiac examinations. Price: ₱800, Duration: 30 minutes.',
            'ecg': 'Electrocardiogram testing for heart health monitoring. Price: ₱400, Duration: 20 minutes.',
            
            # Appointments
            'appointment': 'To book an appointment, please login and visit our booking page, or call us at (043) 286-2531. You can book online 24/7.',
            'book': 'You can book appointments online through our website after logging in, or call (043) 286-2531.',
            'schedule': 'Our laboratory is open Monday to Saturday, 8:00 AM to 6:00 PM. You can schedule appointments during these hours.',
            'cancel': 'To cancel an appointment, please login to your account and go to your dashboard, or call us at (043) 286-2531.',
            
            # Payment and Financial
            'payment': 'We accept cash, GCash, PayMaya, bank transfers, credit cards, HMO, and cheque payments. We also offer installment options and financial assistance.',
            'financial assistance': 'We offer various financial assistance options including HMO coverage, senior citizen discounts, PWD discounts, and flexible payment plans.',
            'hmo': 'We accept most HMO providers with up to 80% coverage. Please bring your HMO card and valid ID.',
            'installment': 'We offer flexible installment payment plans for expensive procedures. Please inquire at our reception.',
            
            # Results and Certificates
            'results': 'Test results are usually available within 24-48 hours. You will be notified via SMS/email when ready. You can also check online through your patient portal.',
            'medical certificate': 'We issue various medical certificates including fitness certificates, sick leave certificates, and employment clearances. Please request through your patient dashboard.',
            
            # Emergency and Support
            'emergency': 'For medical emergencies, please call 911 or go to the nearest emergency room. Our laboratory provides diagnostic services, not emergency care.',
            'live admin': 'I\'m connecting you to a live administrator. Please hold on...',
            'help': 'I can help you with information about our services, booking appointments, payment options, test results, and general inquiries. What would you like to know?',
            
            # Contact Information
            'contact': 'You can reach us at (043) 286-2531 or email info@maeslaboratory.com. We\'re also available through this chat during business hours.',
            'hours': 'We are open Monday to Saturday, 8:00 AM to 6:00 PM. We are closed on Sundays and holidays.',
            'location': 'We are located in Batangas City, Philippines. Please visit our contact page for the exact address and directions.',
        }
        
        self.faqs = [
            {
                'question': 'What are your operating hours?',
                'answer': 'We are open Monday to Saturday, 8:00 AM to 6:00 PM. Closed on Sundays and holidays.'
            },
            {
                'question': 'How do I book an appointment?',
                'answer': 'You can book online through our website after registration, or call us at (043) 286-2531.'
            },
            {
                'question': 'What payment methods do you accept?',
                'answer': 'We accept cash, GCash, PayMaya, bank transfers, credit cards, HMO, and cheque payments.'
            },
            {
                'question': 'How long does it take to get test results?',
                'answer': 'Most test results are available within 24-48 hours. Complex tests may take 3-5 days.'
            },
            {
                'question': 'Do you accept walk-in patients?',
                'answer': 'Yes, but appointments are recommended for faster service and guaranteed availability.'
            }
        ]
    
    def get_response(self, message):
        """Get chatbot response based on user message"""
        message = message.lower().strip()
        
        # Check for FAQ requests
        if 'faq' in message or 'frequently asked' in message:
            return self.get_faqs_response()
        
        # Check for live admin request
        if 'live admin' in message or 'human' in message or 'representative' in message:
            return {
                'response': 'I\'m connecting you to a live administrator. Please provide your contact details and we\'ll have someone assist you within 15 minutes.',
                'action': 'request_live_admin'
            }
        
        # Find matching response
        for keyword, response in self.responses.items():
            if keyword in message:
                return {'response': response}
        
        # Default response with suggestions
        return {
            'response': 'I\'d be happy to help! Here are some things you can ask me about:',
            'suggestions': [
                'Book an appointment',
                'View our services',
                'Payment options',
                'Test results',
                'Operating hours',
                'Contact information',
                'Financial assistance',
                'Medical certificates'
            ]
        }
    
    def get_faqs_response(self):
        """Return frequently asked questions"""
        faq_text = "Here are our frequently asked questions:\n\n"
        for i, faq in enumerate(self.faqs, 1):
            faq_text += f"{i}. Q: {faq['question']}\n   A: {faq['answer']}\n\n"
        
        return {
            'response': faq_text,
            'faqs': self.faqs
        }

# Initialize chatbot service
chatbot = ChatbotService()

@csrf_exempt
@require_http_methods(["POST"])
def enhanced_chatbot_api(request):
    """Enhanced chatbot API with more features"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()
        
        if not message:
            return JsonResponse({
                'response': 'Please type a message.',
                'suggestions': ['Hello', 'Services', 'Book appointment', 'FAQ']
            })
        
        # Get chatbot response
        bot_response = chatbot.get_response(message)
        
        return JsonResponse(bot_response)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'})
    except Exception as e:
        return JsonResponse({'error': 'Something went wrong. Please try again.'})
