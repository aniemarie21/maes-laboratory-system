"""
URL configuration for maes_lab project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('hospital.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/', include('hospital.api_urls')),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Custom admin site configuration
admin.site.site_header = "MAES Laboratory Management System"
admin.site.site_title = "MAES Lab Admin"
admin.site.index_title = "Welcome to MAES Laboratory Administration"
