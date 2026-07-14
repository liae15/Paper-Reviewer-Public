import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";
import { SignatureV4 } from "@smithy/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@smithy/protocol-http";

function getAgentCoreUrl(): string {
  const runtimeArn = process.env.AGENTCORE_RUNTIME_ARN;
  if (runtimeArn) {
    const region = (process.env.AWS_REGION || "us-east-1").trim();
    const qualifier = process.env.AGENTCORE_QUALIFIER || "DEFAULT";
    return `https://bedrock-agentcore.${region}.amazonaws.com/runtimes/${encodeURIComponent(
      runtimeArn,
    )}/invocations?qualifier=${encodeURIComponent(qualifier)}`;
  }

  return process.env.AGENTCORE_ENDPOINT_URL!;
}

async function agentCoreFetch(url: string, init?: RequestInit): Promise<Response> {
  const parsedUrl = new URL(url);
  const body = init?.body != null ? (init.body as string) : undefined;
  // Optional future path only. This project currently uses IAM/SigV4 because
  // Cognito setup was not available, so AGENTCORE_BEARER_TOKEN is expected
  // to be unset for local development.
  const bearerToken = process.env.AGENTCORE_BEARER_TOKEN;
  const baseHeaders: Record<string, string> = {
    "content-type": "application/json",
    accept: "text/event-stream",
    "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id": crypto.randomUUID(),
  };

  if (bearerToken) {
    const response = await fetch(url, {
      method: init?.method || "POST",
      headers: {
        ...baseHeaders,
        Authorization: `Bearer ${bearerToken}`,
      },
      body,
    });
    await logAgentCoreError(response);
    return response;
  }

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: (process.env.AWS_REGION || "us-east-1").trim(),
    service: "bedrock-agentcore",
    sha256: Sha256,
  });

  const request = new HttpRequest({
    method: (init?.method as string) || "POST",
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname,
    query: Object.fromEntries(parsedUrl.searchParams),
    headers: {
      host: parsedUrl.hostname,
      ...baseHeaders,
    },
    body,
  });

  const signed = await signer.sign(request);

  const response = await fetch(url, {
    method: signed.method,
    headers: signed.headers as Record<string, string>,
    body,
  });
  await logAgentCoreError(response);
  return response;
}

async function logAgentCoreError(response: Response): Promise<void> {
  if (response.ok) return;

  const responseText = await response
    .clone()
    .text()
    .catch(() => "<unable to read response body>");

  console.error("[AgentCore] request failed", {
    status: response.status,
    statusText: response.statusText,
    body: responseText.slice(0, 1000),
  });
}

const runtime = new CopilotRuntime({
  agents: {
    my_agent: new HttpAgent({
      url: getAgentCoreUrl(),
      fetch: agentCoreFetch,
    }),
  },
});

const handler = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};

export const GET = handler;
export const POST = handler;
export const OPTIONS = handler;
