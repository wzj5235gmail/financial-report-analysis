from rest_framework import serializers
from .models import FinancialReport, FinancialReportAnalysis, FileUpload


class FinancialReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialReport
        fields = "__all__"


class FinancialReportAnalysisSerializer(serializers.ModelSerializer):
    financial_report = FinancialReportSerializer()

    class Meta:
        model = FinancialReportAnalysis
        fields = "__all__"


class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = "__all__"
