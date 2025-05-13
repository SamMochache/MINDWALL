from rest_framework import generics
from .models import Log ,Response as ResponseModel
from .serializers import LogSerializer, ResponseSerializer
from rest_framework.response import Response as DRFResponse
from rest_framework.views import APIView
from rest_framework import status
from .ai_agent import policy_decision


# Simple threat detection logic
THREAT_KEYWORDS = {
    "SSH": "High",
    "login failed": "Medium",
    "unauthorized": "High",
    "malware": "High",
    "sql injection": "Critical",
    "port scan": "Medium",
    "unknown": "Low"
}

def detect_threat_level(content):
    for keyword, level in THREAT_KEYWORDS.items():
        if keyword.lower() in content.lower():
            return level
    return "Low"

class LogListCreateView(generics.ListCreateAPIView):
    queryset = Log.objects.all().order_by('-timestamp')
    serializer_class = LogSerializer

    def perform_create(self, serializer):
        content = self.request.data.get('content', '')
        threat_level = detect_threat_level(content)
        prediction = "Threat" if threat_level != "Low" else "Normal"
        serializer.save(prediction=prediction, threat_level=threat_level)


class TriggerResponseView(APIView):
    def post(self, request, log_id):
        try:
            log = Log.objects.get(id=log_id)
        except Log.DoesNotExist:
            return DRFResponse({"error": "Log not found"}, status=status.HTTP_404_NOT_FOUND)

        action = policy_decision(log.threat_level)
        response_record = ResponseModel.objects.create(
            log=log,
            action=action,
            success=True,  # Simulate success
            notes=f"Automated action for threat level: {log.threat_level}"
        )
        serializer = ResponseSerializer(response_record)
        return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)