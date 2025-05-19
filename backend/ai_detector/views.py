from rest_framework import generics, status, permissions
from rest_framework.response import Response as DRFResponse
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Log, Response as ResponseModel
from .serializers import LogSerializer, ResponseSerializer, UserSerializer
from .services.threat_detector import ThreatDetector
from .services.response_service import ResponseService


class StandardResultsSetPagination(PageNumberPagination):
    """Pagination class for API result sets"""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class RegisterView(generics.CreateAPIView):
    """API endpoint for registering new users"""
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class LogListCreateView(generics.ListCreateAPIView):
    """API endpoint for listing and creating logs"""
    serializer_class = LogSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter logs based on query parameters"""
        queryset = Log.objects.filter(is_deleted=False).order_by('-timestamp')
        
        # Apply filters if provided
        threat_level = self.request.query_params.get('threat_level')
        search = self.request.query_params.get('search')
        
        if threat_level and threat_level.lower() != 'all':
            queryset = queryset.filter(threat_level=threat_level)
            
        if search:
            queryset = queryset.filter(
                Q(content__icontains=search) | 
                Q(source_ip__icontains=search)
            )
            
        return queryset

    def perform_create(self, serializer):
        """Create a new log with threat detection"""
        content = self.request.data.get('content', '')
        source_ip = self.request.data.get('source_ip', '')
        
        # Use the threat detector service
        detector = ThreatDetector()
        analysis = detector.analyze_log(content)
        
        # Save log with the analysis results and user info
        serializer.save(
            prediction=analysis['prediction'],
            threat_level=analysis['threat_level'],
            created_by=self.request.user
        )


class TriggerResponseView(APIView):
    """API endpoint for triggering a response to a security incident"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, log_id):
        """Create a response for the specified log"""
        log = get_object_or_404(Log, id=log_id, is_deleted=False)
        
        # Use the response service
        response_service = ResponseService()
        response_details = response_service.get_response_details(
            log.threat_level, 
            log.id,
            log.source_ip
        )
        
        # Create response record
        response_record = ResponseModel.objects.create(
            log=log,
            action=response_details['action'],
            success=response_details['success'],
            notes=response_details['notes'],
            created_by=request.user
        )
        
        serializer = ResponseSerializer(response_record)
        return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)