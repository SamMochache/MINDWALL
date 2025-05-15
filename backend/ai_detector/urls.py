from django.urls import path
from .views import LogListCreateView , TriggerResponseView, RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('logs/', LogListCreateView.as_view(), name='log-list'),
    path('logs/<int:log_id>/respond/', TriggerResponseView.as_view(), name='trigger-response'),
     # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
