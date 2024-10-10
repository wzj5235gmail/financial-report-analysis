# Use the conda base image
FROM continuumio/miniconda3:latest

# Set the working directory in the container
WORKDIR /app

# Install system dependencies including gcc
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install the dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the Django Rest Framework migrate and runserver
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]


# docker build -t financial-report-analysis-backend .
# docker run -p 8000:8000 financial-report-analysis-backend

