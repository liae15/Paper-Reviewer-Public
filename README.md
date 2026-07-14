# Paper Reviewer

Strands-based research agent integrated with AgentCore, Bedrock, CopilotKit, and AGUI. Includes a knowledge base for analyzing and comparing academic sources on AI in economic decision-making.

## What This Does

You give it a research paper, and it gives you back a structured summary, a glossary of key terms, and (once you've fed it more than one paper) a side-by-side comparison. Every finding gets labeled as evidence, inference, or speculation, and the terminology stays consistent across sources using a built-in dictionary of AI and economics terms.

This started during my internship at Ichilov, where I was building a scheduler for doctors. The agent framework I used there gave me the idea to build something like this for my own coursework on AI in economic decision-making, where there's a lot of cross-referencing to do by hand.

It doesn't replace reading the paper. It makes the reading more useful.

## Project Structure

```
Analyzer/
├── AGUI-CLI/
│   └── Paper-Reviewer/            # The agent project
│       ├── agentcore/              # AWS deployment config
│       │   ├── agentcore.json      # Runtime, memory, env vars (KB IDs live here)
│       │   └── cdk/                # CDK infrastructure
│       ├── app/
│       │   └── AnalyzerAgent/      # The actual agent
│       │       ├── main.py         # Entry point, system prompt, tool registration
│       │       ├── model/          # Bedrock model config
│       │       ├── memory/         # Session memory
│       │       ├── tools/          # Custom tools (upload_paper, save_output)
│       │       ├── knowledge_base/ # Instructions + templates (baked into container)
│       │       └── Dockerfile
│       └── knowledge_base/         # Same KB files, at project level for visibility
├── copilotkit-ui/                  # Next.js chat interface
│   ├── src/app/page.tsx            # Main page + sidebar config
│   └── .env.local                  # Runtime ARN goes here
└── aws-auth/                       # Cognito setup scripts
```

## Where Things Live

**Agent config and environment variables** are in `AGUI-CLI/Paper-Reviewer/agentcore/agentcore.json`. This is where the Knowledge Base ID, Data Source ID, and S3 bucket name are set. If you need to change any of those, that's the file.

**The knowledge base files** (agent_scope.md, analysis_schema.md, topic_dictionary.md, and the example templates) exist in two places: `AGUI-CLI/Paper-Reviewer/knowledge_base/` so reviewers can find them, and `AGUI-CLI/Paper-Reviewer/app/AnalyzerAgent/knowledge_base/` so they get copied into the Docker container at build time. They need to match.

**Uploaded papers** go to `s3://<your-bucket>/papers/`. You can upload them through the chat UI or drop them directly into the bucket and sync.

**Generated outputs** (summaries, glossaries, comparisons) get saved to `s3://<your-bucket>/outputs/` and are also displayed directly in the chat.

**The CopilotKit UI** lives at the repo root in `copilotkit-ui/`. It connects to the deployed agent via the runtime ARN in `copilotkit-ui/.env.local`. If you redeploy and get a new ARN, update it there.

**AWS auth scripts** are in `aws-auth/`. These set up Cognito for authenticated access.

## Getting Started

You'll need Node.js 20+, Python 3.12+, Docker, and AWS credentials configured.

**Deploy the agent:**

```bash
cd AGUI-CLI/Paper-Reviewer/agentcore/cdk
npm install
cd ../..
agentcore deploy
```

**Run the UI:**

```bash
cd copilotkit-ui
npm install
npm run dev
```

Then open `http://localhost:3000`. The chat sidebar accepts file attachments (PDFs, markdown, plain text). Upload a paper, and the agent takes it from there.

## Tools

The agent has a few custom tools beyond the standard Strands toolkit:

**upload_paper** saves a file to the S3 papers bucket and triggers a Bedrock Knowledge Base sync, so the paper becomes searchable via RAG.

**save_output** saves generated analysis files (summaries, glossaries, comparisons) to the S3 outputs bucket. The agent always displays results in chat and saves them, so you get both.

**retrieve** searches across all uploaded papers using the Bedrock Knowledge Base. This is what lets the agent answer questions that span multiple sources.

## The Knowledge Base

The knowledge base isn't a database. It's a set of markdown files that tell the agent how to behave and what format to use. I've been doing similar work in my current internship as a product analyst, building knowledge bases for production use. There are three instruction files (agent_scope.md, analysis_schema.md, topic_dictionary.md) and three example templates that show the agent what its output should look like. The agent reads these at startup, so they're always in context.

To understand what the agent does, start with `AGUI-CLI/Paper-Reviewer/knowledge_base/agent_scope.md`. To see what it produces, look at the example files (prefixed with `_example_`).

## Tech Stack

- [Strands Agents SDK](https://strandsagents.com/) for the agent framework
- [Amazon Bedrock](https://aws.amazon.com/bedrock/) for the LLM (Claude Sonnet 4.5) and Knowledge Base (RAG)
- [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) for deployment and runtime
- [CopilotKit](https://www.copilotkit.ai/) + [AG-UI](https://docs.copilotkit.ai/) for the chat interface
- [AWS CDK](https://aws.amazon.com/cdk/) for infrastructure
