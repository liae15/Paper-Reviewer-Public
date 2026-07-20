import os
from pathlib import Path

# Suppress OpenTelemetry warnings during local development; remove for production
if os.getenv("LOCAL_DEV") == "1":
    os.environ["OTEL_SDK_DISABLED"] = "true"

import uvicorn
from strands import Agent
from strands_tools import file_read, file_write, python_repl

# Ensure KB env vars are set even if AgentCore doesn't pass them through CFN
_KB_DEFAULTS = {
    "KNOWLEDGE_BASE_ID": "<YOUR_KNOWLEDGE_BASE_ID>",
    "KB_DATA_SOURCE_ID": "<YOUR_DATA_SOURCE_ID>",
    "KB_S3_BUCKET": "<YOUR_S3_BUCKET_NAME>",
}
for _k, _v in _KB_DEFAULTS.items():
    if not os.getenv(_k):
        os.environ[_k] = _v
from tools import upload_paper, save_output, retrieve
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

KB_PATH = str(KB_DIR.resolve())

SYSTEM_PROMPT = f"""You are a research analysis agent specialized in AI and economic decision-making. You analyze user-supplied academic sources, generate structured outputs, and compare findings across papers.

## Your Instructions: {agent_scope}

The analysis schema is located at: {KB_PATH}/analysis_schema.md. Use it when you need to populate a summary table.
The topic dictionary is located at: {KB_PATH}/topic_dictionary.md. Use it when you need to clarify the meaning of a term or concept, or when you need to ensure consistent terminology across your analysis.

## File Operations

There are TWO separate storage locations. Do not confuse them:

1. LOCAL templates directory ({KB_PATH}): contains analysis_schema.md, topic_dictionary.md, and _example_*.md templates. Use file_read ONLY for these template/reference files.
2. BEDROCK KNOWLEDGE BASE (cloud): contains uploaded research papers. Use the retrieve tool to search paper content. Do NOT try to file_read uploaded papers -- they are not on the local filesystem.

When a user says they uploaded a paper:
- Use the retrieve tool to search for its content by topic, author name, or key terms.
- If retrieve returns no results, the knowledge base sync may still be in progress. Tell the user to wait 30-60 seconds and try again.
- NEVER try to file_read a paper from {KB_PATH} -- papers are not stored there.

- Use upload_paper only when a user pastes content or provides a local file path.
- Use python_repl for any quantitative analysis.

## File Reading Rules - CRITICAL

- Do NOT read the same file more than once per conversation. If you already read a template or reference file earlier, use the content from memory rather than calling file_read again.
- Each file_read result stays in your conversation history. Re-reading the same file causes a "duplicate document names" error that will crash the conversation.

## Output Rules - CRITICAL

When you generate any output (summary, glossary, or comparative summary):
1. Display the full content in the chat so the user can see it immediately. Do NOT truncate or summarize it.
2. After displaying, call save_output with the filename and the same content to persist it to S3.
3. NEVER claim you saved a file without actually calling save_output. If save_output fails, tell the user.
4. Do NOT use file_write for outputs - use save_output instead, which saves to S3 where files persist.

## Communication Style

- The KNOWLEDGE_BASE_ID is always configured. Do not check or print environment variables — just call retrieve directly.
- Do NOT expose technical details to the user. Never mention environment variables, API errors, stack traces, AWS internals, or tool configuration in your responses.
- If something fails, give a short, friendly explanation (e.g. "I wasn't able to find that paper yet — it may still be syncing. Try again in a minute."). Only share technical details if the user explicitly asks.
- Keep your reasoning internal. Do not narrate what tools you are calling or why.
"""

tools = [file_read, file_write, python_repl, retrieve, upload_paper, save_output]

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
