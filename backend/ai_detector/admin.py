from django.contrib import admin
from .models import Log

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('source_ip', 'timestamp', 'threat_level', 'prediction')
    search_fields = ('source_ip', 'content', 'threat_level')
