"""Custom tool: upload a paper to S3 and sync the Bedrock Knowledge Base."""

import os
import boto3
from strands import tool

S3_BUCKET = os.getenv("KB_S3_BUCKET", "")
S3_PREFIX = os.getenv("KB_S3_PREFIX", "papers/")
KB_ID = os.getenv("KNOWLEDGE_BASE_ID", "")
DS_ID = os.getenv("KB_DATA_SOURCE_ID", "")
REGION = os.getenv("AWS_REGION", "us-east-1")


@tool
def upload_paper(file_path: str, filename: str = "") -> str:
    """Upload a local file to the knowledge base S3 bucket and trigger a sync.

    Args:
        file_path: Absolute path to the file on the server filesystem.
        filename: Optional name for the file in S3. Defaults to the original filename.

    Returns:
        Status message indicating success or failure.
    """
    import os.path

    if not os.path.exists(file_path):
        return f"Error: file not found at {file_path}"

    if not filename:
        filename = os.path.basename(file_path)

    s3_key = f"{S3_PREFIX}{filename}"

    try:
        s3 = boto3.client("s3", region_name=REGION)
        s3.upload_file(file_path, S3_BUCKET, s3_key)
        result = f"Uploaded {filename} to s3://{S3_BUCKET}/{s3_key}"
    except Exception as e:
        return f"Error uploading to S3: {e}"

    # Trigger knowledge base sync if data source ID is configured
    if KB_ID and DS_ID:
        try:
            bedrock = boto3.client("bedrock-agent", region_name=REGION)
            response = bedrock.start_ingestion_job(
                knowledgeBaseId=KB_ID,
                dataSourceId=DS_ID,
            )
            job_id = response["ingestionJob"]["ingestionJobId"]
            result += f"\nSync started (job: {job_id}). The paper will be searchable shortly."
        except Exception as e:
            result += f"\nUploaded but sync failed: {e}. You can sync manually in the Bedrock console."
    else:
        result += "\nNote: KB_DATA_SOURCE_ID not set — sync the knowledge base manually in the AWS console."

    return result
