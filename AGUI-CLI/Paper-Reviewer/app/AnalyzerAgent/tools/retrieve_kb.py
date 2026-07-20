"""Custom retrieve tool for Bedrock Knowledge Bases using managed embeddings.

The built-in strands_tools.retrieve hardcodes vectorSearchConfiguration, which
doesn't work with KBs created with managed embeddings. This version uses
managedSearchConfiguration instead.
"""

import os
from typing import Any

import boto3
from botocore.config import Config as BotocoreConfig
from strands.types.tools import ToolResult, ToolUse

TOOL_SPEC = {
    "name": "retrieve",
    "description": (
        "Retrieves knowledge from Amazon Bedrock Knowledge Bases using semantic search. "
        "Use this to search uploaded research papers by topic, author, or key terms. "
        "Returns results sorted by relevance score."
    ),
    "inputSchema": {
        "json": {
            "type": "object",
            "properties": {
                "text": {
                    "type": "string",
                    "description": "The query to search for in the knowledge base.",
                },
                "numberOfResults": {
                    "type": "integer",
                    "description": "Maximum number of results to return. Default is 10.",
                },
            },
            "required": ["text"],
        }
    },
}


def retrieve(tool: ToolUse, **kwargs: Any) -> ToolResult:
    kb_id = os.getenv("KNOWLEDGE_BASE_ID")
    region = os.getenv("AWS_REGION", "us-east-1")
    tool_use_id = tool["toolUseId"]
    tool_input = tool["input"]

    if not kb_id:
        return {
            "toolUseId": tool_use_id,
            "status": "error",
            "content": [{"text": "KNOWLEDGE_BASE_ID environment variable is not set."}],
        }

    try:
        query = tool_input["text"]
        num_results = tool_input.get("numberOfResults", 10)

        config = BotocoreConfig(user_agent_extra="strands-agents-retrieve-managed")
        client = boto3.client("bedrock-agent-runtime", region_name=region, config=config)

        response = client.retrieve(
            retrievalQuery={"text": query},
            knowledgeBaseId=kb_id,
            retrievalConfiguration={
                "managedSearchConfiguration": {
                    "additionalModelRequestFields": {},
                }
            },
        )

        results = response.get("retrievalResults", [])

        if not results:
            return {
                "toolUseId": tool_use_id,
                "status": "success",
                "content": [{"text": "No results found. The knowledge base may be empty or the sync is still in progress."}],
            }

        formatted = []
        for r in results:
            score = r.get("score", 0.0)
            location = r.get("location", {})
            doc_id = "Unknown"
            if "s3Location" in location:
                doc_id = location["s3Location"].get("uri", "Unknown")
            elif "customDocumentLocation" in location:
                doc_id = location["customDocumentLocation"].get("id", "Unknown")

            content = r.get("content", {})
            text = content.get("text", "") if isinstance(content, dict) else ""

            formatted.append(f"\nScore: {score:.4f}\nDocument: {doc_id}\nContent: {text}\n")

        return {
            "toolUseId": tool_use_id,
            "status": "success",
            "content": [{"text": f"Retrieved {len(results)} results:\n{''.join(formatted)}"}],
        }

    except Exception as e:
        return {
            "toolUseId": tool_use_id,
            "status": "error",
            "content": [{"text": f"Error during retrieval: {str(e)}"}],
        }
