from rest_framework import serializers
from .models import Log, Response

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'
        read_only_fields = ('timestamp',)


class LogSerializer(serializers.ModelSerializer):
    responses = ResponseSerializer(many=True, read_only=True)
    class Meta:
        model = Log
        fields = '__all__'
        read_only_fields = ('prediction', 'threat_level')
