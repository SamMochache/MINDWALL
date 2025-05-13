from django.urls import path
from .views import LogListCreateView , TriggerResponseView

urlpatterns = [
    path('logs/', LogListCreateView.as_view(), name='log-list'),
    path('logs/<int:log_id>/respond/', TriggerResponseView.as_view(), name='trigger-response')
]
