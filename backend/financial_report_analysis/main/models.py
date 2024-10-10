from django.db import models


# Create your models here.
class FinancialReport(models.Model):
    id = models.AutoField(primary_key=True)
    file_name = models.CharField(max_length=256, default="")
    s3_url = models.URLField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        "auth.User", related_name="financial_reports", on_delete=models.CASCADE
    )
    file_hash = models.CharField(max_length=256, default="")

    def __str__(self):
        return self.file_name


class FinancialReportAnalysis(models.Model):
    id = models.AutoField(primary_key=True)
    financial_report = models.ForeignKey(FinancialReport, on_delete=models.CASCADE)
    analysis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        "auth.User", related_name="financial_report_analyses", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.analysis


class FileUpload(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(upload_to="files/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        "auth.User", related_name="file_uploads", on_delete=models.CASCADE
    )
