/**
 * POST /api/upload
 *
 * Receives a PDF (multipart form-data), uploads it to the Paper Reviewer S3
 * bucket under the papers/ prefix, and kicks off a Bedrock Knowledge Base
 * ingestion job so the agent can search the paper via the `retrieve` tool.
 *
 * Environment variables (same ones the agent uses):
 *   KB_S3_BUCKET          – e.g. my-kb-bucket
 *   KNOWLEDGE_BASE_ID     – Bedrock KB id
 *   KB_DATA_SOURCE_ID     – Bedrock KB data-source id
 *   AWS_REGION            – defaults to us-east-1
 */

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  BedrockAgentClient,
  StartIngestionJobCommand,
} from "@aws-sdk/client-bedrock-agent";

const REGION = (process.env.AWS_REGION || "us-east-1").trim();
const BUCKET = process.env.KB_S3_BUCKET || "";
const KB_ID = process.env.KNOWLEDGE_BASE_ID || "";
const DS_ID = process.env.KB_DATA_SOURCE_ID || "";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!BUCKET) {
      return NextResponse.json(
        { error: "KB_S3_BUCKET not configured" },
        { status: 500 },
      );
    }

    // Read file bytes
    const bytes = new Uint8Array(await file.arrayBuffer());
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const s3Key = `papers/${filename}`;

    // Upload to S3
    const s3 = new S3Client({ region: REGION });
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: s3Key,
        Body: bytes,
        ContentType: file.type || "application/pdf",
      }),
    );

    // Trigger KB sync
    let syncStatus = "skipped";
    if (KB_ID && DS_ID) {
      try {
        const bedrock = new BedrockAgentClient({ region: REGION });
        const resp = await bedrock.send(
          new StartIngestionJobCommand({
            knowledgeBaseId: KB_ID,
            dataSourceId: DS_ID,
          }),
        );
        syncStatus = `started (job: ${resp.ingestionJob?.ingestionJobId})`;
      } catch (syncErr: unknown) {
        const msg =
          syncErr instanceof Error ? syncErr.message : String(syncErr);
        syncStatus = `failed: ${msg}`;
      }
    }

    return NextResponse.json({
      filename,
      s3Uri: `s3://${BUCKET}/${s3Key}`,
      sync: syncStatus,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
