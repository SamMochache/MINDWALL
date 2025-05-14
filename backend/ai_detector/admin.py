from django.contrib import admin
from .models import Log, Response

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    list_display = ('source_ip', 'timestamp', 'threat_level', 'prediction')
    search_fields = ('source_ip', 'content', 'threat_level')

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('log', 'action', 'timestamp', 'success')
    search_fields = ('log__source_ip', 'action', 'success')
    list_filter = ('success',)
