"""
API views for MAES Hospital Management System
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Appointment, LabService, TestResult, PaymentTransaction
from .serializers import (
    AppointmentSerializer, LabServiceSerializer, 
    TestResultSerializer, PaymentTransactionSerializer
)

class AppointmentListCreateView(generics.ListCreateAPIView):
    """List and create appointments"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.user_type == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete appointment"""
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'appointment_id'
    
    def get_queryset(self):
        if hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.user_type == 'admin':
            return Appointment.objects.all()
        return Appointment.objects.filter(patient=self.request.user)

class LabServiceListView(generics.ListAPIView):
    """List all active laboratory services"""
    queryset = LabService.objects.filter(is_active=True)
    serializer_class = LabServiceSerializer

class TestResultListView(generics.ListAPIView):
    """List test results"""
    serializer_class = TestResultSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.user_type == 'admin':
            return TestResult.objects.all()
        return TestResult.objects.filter(patient=self.request.user)

class PaymentTransactionListView(generics.ListAPIView):
    """List payment transactions"""
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if hasattr(self.request.user, 'userprofile') and self.request.user.userprofile.user_type == 'admin':
            return PaymentTransaction.objects.all()
        return PaymentTransaction.objects.filter(patient=self.request.user)
