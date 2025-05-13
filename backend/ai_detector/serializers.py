from rest_framework import serializers
from .models import Log, Response

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'
        read_only_fields = ('prediction', 'threat_level')


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = '__all__'
        read_only_fields = ('timestamp',)
