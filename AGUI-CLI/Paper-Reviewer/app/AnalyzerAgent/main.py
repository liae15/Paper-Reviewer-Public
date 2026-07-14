import os
from pathlib import Path

# Suppress OpenTelemetry warnings during local development; remove for production
if os.getenv("LOCAL_DEV") == "1":
    os.environ["OTEL_SDK_DISABLED"] = "true"

import uvicorn
from strands import Agent
from strands_tools import file_read, file_write, editor, shell, python_repl, retrieve
from tools import upload_paper, save_output
from ag_ui_strands import StrandsAgent, StrandsAgentConfig, create_strands_app
from model.load import load_model
from memory.session import get_memory_session_manager

# --- Load knowledge base files into system prompt at startup ---
KB_DIR = Path(__file__).parent / "knowledge_base"

def _read_kb(filename: str) -> str:
    path = KB_DIR / filename
    if path.exists():
        return path.read_text(encoding="utf-8")
    return f"[WARNING: {filename} not found at {path}]"

agent_scope = _read_kb("agent_scope.md")
analysis_schema = _read_kb("analysis_schema.md")
topic_dictionary = _read_kb("topic_dictionary.md")

KB_PATH = str(KB_DIR.resolve())

SYSTEM_PROMPT = f"""You are a research analysis agent specialized in AI and economic decision-making. You analyze user-supplied academic sources, generate structured outputs, and compare findings across papers.

## Your Instructions

{agent_scope}

## Analysis Schema

{analysis_schema}

## Topic Dictionary

{topic_dictionary}

## File Operations

- Knowledge base files are at: {KB_PATH}
- Example templates are in the same directory — use file_read to load _example_summary.md, _example_glossary.md, or _example_comparative_summary.md when you need to check the exact output format.
- If a Bedrock Knowledge Base is configured, use the retrieve tool to search across uploaded papers.
- Use upload_paper to add a new paper to the knowledge base. The user can provide a file path or paste content that you save with file_write first, then upload.
- Use python_repl for any quantitative analysis.

## Output Rules — CRITICAL

When you generate any output (summary, glossary, or comparative summary):
1. ALWAYS display the full markdown content directly in your chat response so the user can see it immediately.
2. ALWAYS call save_output with the filename and content to persist it to S3.
3. NEVER claim you saved a file without actually calling save_output. If save_output fails, tell the user.
4. Do NOT use file_write for outputs — use save_output instead, which saves to S3 where files persist.
"""

tools = [file_read, file_write, editor, shell, python_repl, retrieve, upload_paper, save_output]

agent = Agent(
    model=load_model(),
    system_prompt=SYSTEM_PROMPT,
    tools=tools,
)

def session_manager_provider(input_data):
    return get_memory_session_manager(input_data.thread_id, "default-user")

config = StrandsAgentConfig(session_manager_provider=session_manager_provider)

agui_agent = StrandsAgent(
    agent=agent,
    name="AnalyzerAgent",
    description="Research analysis agent for comparing academic sources on AI in economic decision-making",
    config=config,
)
app = create_strands_app(agui_agent, path="/invocations", ping_path="/ping")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8080")))
