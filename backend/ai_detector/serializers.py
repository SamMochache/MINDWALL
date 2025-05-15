from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Log, Response, UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=[
        ('admin', 'Administrator'),
        ('analyst', 'Security Analyst'),
        ('viewer', 'Viewer')
    ], default='viewer', write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')
        read_only_fields = ('id',)
    
    def create(self, validated_data):
        role = validated_data.pop('role', 'viewer')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ('username', 'email', 'role', 'notification_email', 'receive_alerts')

class ResponseSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Response
        fields = ('id', 'log', 'action', 'timestamp', 'success', 'notes', 'created_by_username')
        read_only_fields = ('timestamp', 'created_by_username')


class LogSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(many=True, read_only=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Log
        fields = ('id', 'source_ip', 'timestamp', 'content', 'prediction', 
                  'threat_level', 'responses', 'created_by_username')
        read_only_fields = ('prediction', 'threat_level', 'created_by_username')