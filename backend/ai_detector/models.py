from django.db import models
from django.contrib.auth.models import User

class Log(models.Model):
    source_ip = models.GenericIPAddressField(db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    content = models.TextField()
    prediction = models.CharField(max_length=100, blank=True)
    threat_level = models.CharField(max_length=50, default="Low", db_index=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_logs')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.source_ip} - {self.threat_level}"
    
    # Implement soft delete
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

class Response(models.Model):
    log = models.ForeignKey(Log, on_delete=models.CASCADE, related_name='responses')
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_responses')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Response to {self.log.id}: {self.action}"
    
    # Implement soft delete
    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.save()

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=[
        ('admin', 'Administrator'),
        ('analyst', 'Security Analyst'),
        ('viewer', 'Viewer')
    ], default='viewer')
    notification_email = models.EmailField(blank=True, null=True)
    receive_alerts = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"