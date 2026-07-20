import { NextRequest, NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";

const REGION = (process.env.AWS_REGION || "us-east-1").trim();
const BUCKET = process.env.KB_S3_BUCKET || "";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");
    const s3 = new S3Client( { region: REGION });

    try {
        if (key) {
            const response = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
            const text = await response.Body?.transformToString();
            return new NextResponse(text, { headers: { "Content-Type": "text/plain" } });

        } else {
            const response = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: "outputs/"}))
            const files = (response.Contents || []).map((item) => ({
                key: item.Key,
                filename: item.Key?.replace("outputs/", ""),
                lastModified: item.LastModified,
            }));
            return NextResponse.json(files);
        }
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
