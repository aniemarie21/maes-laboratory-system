"""
WSGI config for modern_maes project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'modern_maes.settings')

application = get_wsgi_application()
