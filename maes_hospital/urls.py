"""
URL configuration for MAES Hospital Management System.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('hospital_app.urls')),
    path('api/', include('hospital_app.api_urls')),
    path('auth/', include('hospital_app.auth_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "MAES Laboratory Administration"
admin.site.site_title = "MAES Laboratory"
admin.site.index_title = "Hospital Management System"
