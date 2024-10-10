import boto3
import os
import PyPDF2
import requests
import uuid
import hashlib
from anthropic import Anthropic
from django.conf import settings
from dotenv import load_dotenv
from openai import OpenAI
from .models import FinancialReportAnalysis, FinancialReport
import re


load_dotenv()


def convert_pdf_to_text(pdf_file):
    text = ""
    with open(pdf_file, "rb") as pdf_file:
        reader = PyPDF2.PdfReader(pdf_file)
        for page in reader.pages:
            text += page.extract_text()
    return text


def generate_analysis(text, owner, report_id):
    prompt = f"""
    Analyze a financial report and provide investment recommendations based on the analysis.

    Here is the financial report:
    {text}
    
    Evaluate the financial performance of a company by analyzing its financial report. Consider key metrics such as revenue growth, profit margins, debt levels, cash flow, and other relevant financial indicators. Use these insights to form a comprehensive understanding of the company's financial health and future prospects. Based on the analysis, provide clear investment recommendations, justifying your conclusions with data from the financial report.

    # Steps

    1. **Review Financial Report**: Begin by carefully reviewing the financial report, focusing on key aspects such as income statements, balance sheets, and cash flow statements.
    2. **Analyze Key Metrics**: Calculate and analyze key financial metrics, including:
    - Revenue Growth Rate
    - Gross and Net Profit Margins
    - Current and Quick Ratios
    - Debt-to-Equity Ratio
    - Return on Equity (ROE)
    - Free Cash Flow
    3. **Evaluate Financial Health**: Assess the company's overall financial health and stability, noting trends, strengths, and weaknesses observed from the financial data.
    4. **Conduct Industry Comparison**: Compare the company's financial metrics to industry benchmarks or competitors to assess relative performance.
    5. **Analyze Qualitative Factors**: Consider qualitative factors such as market trends, management competence, and competitive positioning.
    6. **Provide Recommendations**: Based on the quantitative and qualitative analysis, provide well-reasoned investment recommendations, supporting your advice with data from the analysis.

    # Output Format

    Provide a detailed written analysis in HTML and tailwind css form, including the following components:
    - Summary of key findings from the financial analysis
    - Evaluation of the company's financial health and position within the industry
    - Justification for each investment recommendation

    # Examples

    **Example 1:**

    **Input:**
    - Financial report of Company A for the fiscal year 2022

    **Output:**
    ```
    <div class="bg-white shadow-lg rounded-xl p-8 mb-8">
        <h2 class="text-2xl font-semibold mb-6 text-blue-700">Financial Report Analysis: Company A (FY 2022)</h2>
        <div class="prose max-w-none">
            <h3 class="text-xl font-medium text-gray-800 mb-4">Key Findings</h3>
            <ul class="list-disc list-inside text-gray-600 mb-6">
                <li>Revenue growth of 15% year-over-year</li>
                <li>Gross profit margin improved from 32% to 35%</li>
                <li>Debt-to-Equity ratio decreased from 1.5 to 1.2</li>
                <li>Free Cash Flow increased by 22%</li>
            </ul>

            <h3 class="text-xl font-medium text-gray-800 mb-4">Financial Health Evaluation</h3>
            <p class="text-gray-600 mb-6">
                Company A demonstrates strong financial health with improving profitability and decreasing leverage. The company's position in the industry remains competitive, outperforming the sector average in terms of revenue growth and cash flow generation.
            </p>

            <h3 class="text-xl font-medium text-gray-800 mb-4">Investment Recommendations</h3>
            <ol class="list-decimal list-inside text-gray-600 mb-6">
                <li class="mb-2"><span class="font-semibold">Buy:</span> Given the strong financial performance and positive industry outlook, we recommend a "Buy" position for long-term investors.</li>
                <li class="mb-2"><span class="font-semibold">Hold:</span> For current shareholders, maintaining the position is advised as the company continues to show promise for future growth.</li>
                <li><span class="font-semibold">Accumulate:</span> For those seeking to enter or increase their position, a strategy of gradual accumulation during market dips could be beneficial.</li>
            </ol>

            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p class="text-sm text-blue-700">Note: While the company shows strong performance, investors should be aware of potential industry disruptions and monitor the company's ability to maintain its growth trajectory.</p>
            </div>
        </div>
    </div>
    ```

    # Notes

    - Ensure that all financial metrics are calculated accurately and relevant benchmarks are used for comparison.
    - Consider both short-term and long-term prospects when making investment recommendations.
    - Highlight any significant risks or considerations that might affect the investment decision.
    - Ensure the output **only contains** HTML and Tailwind CSS.


    """

    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
    )
    content = completion.choices[0].message.content
    return content


def download_pdf_from_url(url):
    if not url.endswith(".pdf"):
        return {"error": "Invalid file type"}
    response = requests.get(url)
    file_name = f"{uuid.uuid4()}.pdf"
    file_path = os.path.join(settings.MEDIA_ROOT, "files", file_name)
    with open(file_path, "wb") as f:
        f.write(response.content)
    return file_path


def upload_pdf_to_s3(file_path, user_id):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        region_name=os.getenv("AWS_REGION"),
    )
    bucket_name = os.getenv("AWS_S3_BUCKET_NAME")
    s3_key = f"files/{user_id}/{file_path.split('/')[-1]}"
    s3.upload_file(file_path, bucket_name, s3_key)
    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
    return s3_url


def hash_file(file_path):
    with open(file_path, "rb") as f:
        file_data = f.read()
    return hashlib.sha256(file_data).hexdigest()


def calculate_file_hash(file):
    sha256_hash = hashlib.sha256()
    if isinstance(file, bytes):
        sha256_hash.update(file)
    else:
        for chunk in iter(lambda: file.read(4096), b""):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()


def remove_outside_html_tags(text):
    # Use regex to find the first and last HTML tags and their content
    match = re.search(r"(<[^>]+>.*</[^>]+>)", text, re.DOTALL)
    if match:
        return match.group(1)
    return ""
