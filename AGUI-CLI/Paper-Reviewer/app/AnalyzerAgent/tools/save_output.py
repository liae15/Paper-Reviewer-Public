"""Custom tool: save an analysis output (summary, glossary, comparison) to S3."""

import os
import boto3
from strands import tool

S3_BUCKET = os.getenv("KB_S3_BUCKET", "")
S3_OUTPUT_PREFIX = os.getenv("KB_OUTPUT_PREFIX", "outputs/")
REGION = os.getenv("AWS_REGION", "us-east-1")


@tool
def save_output(filename: str, content: str) -> str:
    """Save a generated analysis file (summary, glossary, or comparative summary) to S3.

    Args:
        filename: The filename to save as (e.g., summary_korinek_2025.md).
        content: The full markdown content of the file.

    Returns:
        The S3 URL where the file was saved, or an error message.
    """
    s3_key = f"{S3_OUTPUT_PREFIX}{filename}"

    try:
        s3 = boto3.client("s3", region_name=REGION)
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=content.encode("utf-8"),
            ContentType="text/markdown",
        )
        url = f"s3://{S3_BUCKET}/{s3_key}"
        return f"Saved to {url}"
    except Exception as e:
        return f"Error saving to S3: {e}"
