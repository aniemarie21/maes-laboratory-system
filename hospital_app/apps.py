from django.apps import AppConfig


class HospitalAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hospital_app'
    verbose_name = 'MAES Laboratory Management'
    
    def ready(self):
        try:
            import hospital_app.signals
        except ImportError:
            pass
