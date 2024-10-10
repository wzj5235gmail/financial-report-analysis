from django.conf import settings
from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import os
import requests
import uuid
import hashlib

from .models import FinancialReport, FinancialReportAnalysis
from .permissions import isOwnerOrReadOnly
from .serializers import (
    FileUploadSerializer,
    FinancialReportAnalysisSerializer,
    FinancialReportSerializer,
)
from .utils import (
    calculate_file_hash,
    convert_pdf_to_text,
    download_pdf_from_url,
    generate_analysis,
    upload_pdf_to_s3,
    remove_outside_html_tags,
)


class FinancialReportViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated, isOwnerOrReadOnly]

    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer


class FinancialReportAnalysisViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated, isOwnerOrReadOnly]

    queryset = FinancialReportAnalysis.objects.all()
    serializer_class = FinancialReportAnalysisSerializer


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        print("FileUploadView.post() called")
        user_id = request.user.id if request.user.is_authenticated else 1
        request.data["owner"] = user_id
        print(f"User ID: {user_id}")

        file = request.FILES.get("file")
        if not file:
            print("Error: No file provided")
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        print(f"File received: {file.name}")

        # Calculate file hash before saving
        file_hash = calculate_file_hash(file)
        print(f"Calculated file hash: {file_hash}")

        # Check if the file hash already exists in the database
        existing_report = FinancialReport.objects.filter(file_hash=file_hash).first()
        if existing_report:
            print(f"Existing report found with hash: {file_hash}")
            # If the file hash exists, return the existing analysis
            existing_analysis = FinancialReportAnalysis.objects.filter(
                financial_report=existing_report
            ).first()
            if existing_analysis:
                print("Existing analysis found, returning it")
                return Response(existing_analysis.analysis, status=status.HTTP_200_OK)
            print("No existing analysis found for the existing report")
            texts = convert_pdf_to_text(file)
            print("PDF converted to text")
            analysis = generate_analysis(texts, user, existing_report.id)
            analysis = remove_outside_html_tags(analysis)
            print("Analysis generated")
            analysis_instance = FinancialReportAnalysis.objects.create(
                financial_report=existing_report, analysis=analysis, owner=user
            )
            print(f"FinancialReportAnalysis created with ID: {analysis_instance.id}")
            return Response(analysis, status=status.HTTP_200_OK)
        print("No existing report found. Proceeding with new file upload and analysis")
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            print("FileUploadSerializer is valid")
            file_instance = serializer.save()
            full_path = os.path.join(settings.MEDIA_ROOT, str(file_instance.file))
            print(f"File saved to: {full_path}")

            s3_url = upload_pdf_to_s3(full_path, user_id)
            print(f"File uploaded to S3: {s3_url}")

            user = User.objects.get(id=user_id)
            financial_report = FinancialReport.objects.create(
                s3_url=s3_url,
                owner=user,
                file_hash=file_hash,
                file_name=file.name,
            )
            print(f"FinancialReport created with ID: {financial_report.id}")

            texts = convert_pdf_to_text(full_path)
            print("PDF converted to text")
            analysis = generate_analysis(texts, user, financial_report.id)
            analysis = remove_outside_html_tags(analysis)
            # analysis = "test"
            print("Analysis generated")

            # Save the analysis to the database
            analysis_instance = FinancialReportAnalysis.objects.create(
                financial_report=financial_report, analysis=analysis, owner=user
            )
            print(f"FinancialReportAnalysis created with ID: {analysis_instance.id}")

            # Remove the local file after processing
            if os.path.exists(full_path):
                os.remove(full_path)
                print(f"Removed local file: {full_path}")
            else:
                print(f"Local file not found: {full_path}")

            return Response(analysis, status=status.HTTP_200_OK)
        else:
            print(f"FileUploadSerializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FileDownloadView(APIView):
    def post(self, request):
        # Get the current user
        user_id = request.user.id if request.user.is_authenticated else 1
        url = request.data.get("url")
        print(f"Received URL: {url}")
        if not url:
            print("Error: URL is required")
            return Response(
                {"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate hash of the URL to avoid duplicate downloads
        url_hash = hashlib.md5(url.encode()).hexdigest()
        existing_report = FinancialReport.objects.filter(file_hash=url_hash).first()
        if existing_report:
            print(f"Found existing report with URL hash: {url_hash}")
            existing_analysis = FinancialReportAnalysis.objects.filter(
                financial_report=existing_report
            ).first()
            if existing_analysis:
                print("Found existing analysis, returning it")
                return Response(existing_analysis.analysis, status=status.HTTP_200_OK)

        try:
            print(f"Attempting to download PDF from URL: {url}")
            response = requests.get(url)
            response.raise_for_status()
            print("PDF download successful")
        except requests.RequestException as e:
            print(f"Error downloading PDF: {str(e)}")
            return Response(
                {"error": f"Failed to download PDF: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        filename = f"{url.split('/')[-1]}.pdf"
        full_path = os.path.join(settings.MEDIA_ROOT, "files", filename)
        print(f"Generated full path for file: {full_path}")

        # Save the downloaded content
        with open(full_path, "wb") as f:
            f.write(response.content)
        print(f"Saved downloaded content to {full_path}")

        # # Calculate file hash
        file_hash = calculate_file_hash(open(full_path, "rb"))
        print(f"Calculated file hash: {file_hash}")

        # If the file is new, proceed with saving and analysis
        print(f"Processing new file for user: {user_id}")
        s3_url = upload_pdf_to_s3(full_path, user_id)
        print(f"Uploaded file to S3, URL: {s3_url}")

        user = User.objects.get(id=user_id)
        financial_report = FinancialReport.objects.create(
            s3_url=s3_url,
            owner=user,
            file_hash=url_hash,
            file_name=filename,
        )
        print(f"Created new FinancialReport with ID: {financial_report.id}")

        texts = convert_pdf_to_text(full_path)
        print("Converted PDF to text")
        analysis = generate_analysis(texts, user, financial_report.id)
        # analysis = "test"
        print("Generated analysis")

        # Save the analysis to the database
        analysis_instance = FinancialReportAnalysis.objects.create(
            financial_report=financial_report, analysis=analysis, owner=user
        )
        print(f"Created new FinancialReportAnalysis with ID: {analysis_instance.id}")

        # Clean up the temporary file
        os.remove(full_path)
        print(f"Removed temporary file: {full_path}")

        print("Returning analysis response")
        return Response(analysis, status=status.HTTP_200_OK)


class CreateUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        if not password or not email:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "User already exists"}, status=status.HTTP_400_BAD_REQUEST
            )
        user = User.objects.create_user(email=email, password=password, username=email)
        return Response(
            {"message": "User created successfully"}, status=status.HTTP_201_CREATED
        )


class GetHistoryView(APIView):
    def get(self, request):
        user_id = request.user.id if request.user.is_authenticated else 1
        analyses = FinancialReportAnalysis.objects.filter(owner_id=user_id)
        serializer = FinancialReportAnalysisSerializer(analyses, many=True)
        return Response(serializer.data)
