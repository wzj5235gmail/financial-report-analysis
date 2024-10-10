from django.urls import path
from .views import (
    FinancialReportViewSet,
    FinancialReportAnalysisViewSet,
    FileUploadView,
    FileDownloadView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from .views import CreateUserView, GetHistoryView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("upload/", FileUploadView.as_view(), name="upload"),
    path("download/", FileDownloadView.as_view(), name="download"),
    path(
        "financial-reports/",
        FinancialReportViewSet.as_view({"get": "list"}),
        name="financial-reports",
    ),
    path(
        "financial-reports/<int:pk>/",
        FinancialReportViewSet.as_view({"get": "retrieve"}),
        name="financial-report-detail",
    ),
    path(
        "financial-reports/create/",
        FinancialReportViewSet.as_view({"post": "create"}),
        name="financial-report-create",
    ),
    path(
        "financial-reports/update/<int:pk>/",
        FinancialReportViewSet.as_view({"put": "update"}),
        name="financial-report-update",
    ),
    path(
        "financial-reports/delete/<int:pk>/",
        FinancialReportViewSet.as_view({"delete": "destroy"}),
        name="financial-report-delete",
    ),
    path(
        "financial-reports-analysis/",
        FinancialReportAnalysisViewSet.as_view({"get": "list"}),
        name="financial-report-analysis",
    ),
    path(
        "financial-reports-analysis/<int:pk>/",
        FinancialReportAnalysisViewSet.as_view({"get": "retrieve"}),
        name="financial-report-analysis-detail",
    ),
    path(
        "financial-reports-analysis/create/",
        FinancialReportAnalysisViewSet.as_view({"post": "create"}),
        name="financial-report-analysis-create",
    ),
    path(
        "financial-reports-analysis/update/<int:pk>/",
        FinancialReportAnalysisViewSet.as_view({"put": "update"}),
        name="financial-report-analysis-update",
    ),
    path(
        "financial-reports-analysis/delete/<int:pk>/",
        FinancialReportAnalysisViewSet.as_view({"delete": "destroy"}),
        name="financial-report-analysis-delete",
    ),
    path(
        "create-user/",
        CreateUserView.as_view(),
        name="create-user",
    ),
    path(
        "history/",
        GetHistoryView.as_view(),
        name="history",
    ),
]
