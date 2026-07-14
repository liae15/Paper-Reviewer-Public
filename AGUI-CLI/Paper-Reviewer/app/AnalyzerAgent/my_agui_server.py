# my_agui_server.py
#This is a reference document as main.py fulfills the same function as the main entry point for the AG-UI server. It sets up a FastAPI application that serves as the interface for the AG-UI protocol, allowing clients to interact with the Strands agent. The server listens for incoming requests on the /invocations endpoint, processes them using the Strands agent, and returns event streams in response. Additionally, it includes a health check endpoint at /ping to verify that the server is running properly.
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from ag_ui_strands import StrandsAgent
from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from strands import Agent
from strands.models.bedrock import BedrockModel

# Create a simple Strands agent
model = BedrockModel(
    model_id="us.anthropic.claude-3-5-sonnet-20241022-v2:0",
    region_name="us-east-1",
)

strands_agent = Agent(
    model=model,
    system_prompt="You are a helpful assistant.",
)

# Wrap with AG-UI protocol support
agui_agent = StrandsAgent(
    agent=strands_agent,
    name="my_agent",
    description="A helpful assistant",
)

# FastAPI server
app = FastAPI()

@app.post("/invocations")
async def invocations(input_data: dict, request: Request):
    """Main AG-UI endpoint that returns event streams."""
    accept_header = request.headers.get("accept")
    encoder = EventEncoder(accept=accept_header)

    async def event_generator():
        run_input = RunAgentInput(**input_data)
        async for event in agui_agent.run(run_input):
            yield encoder.encode(event)

    return StreamingResponse(
        event_generator(),
        media_type=encoder.get_content_type()
    )

@app.get("/ping")
async def ping():
    return JSONResponse({"status": "Healthy"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
