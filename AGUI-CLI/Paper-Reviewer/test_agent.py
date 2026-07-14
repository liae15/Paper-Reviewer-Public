import boto3
import json
import uuid

# Your specific configuration
REGION = "us-east-1"
AGENT_ARN = "<YOUR_AGENT_RUNTIME_ARN>"

def invoke_agent():
    # Generate a proper session ID (at least 33 characters)
    session_id = f"test-session-{str(uuid.uuid4())}"
    print(f"Using session ID: {session_id} (length: {len(session_id)})")
    
    # Initialize the Bedrock AgentCore client
    agentcore_client = boto3.client('bedrock-agentcore', region_name=REGION)
    
    try:
        print(f"Invoking agent: {AGENT_ARN}")
        print("Sending prompt: 'Describe the types of research analysis you can perform.'")
        
        # Invoke the agent
        response = agentcore_client.invoke_agent_runtime(
            agentRuntimeArn=AGENT_ARN,
            runtimeSessionId=session_id,  # Now using proper length session ID
            payload=json.dumps({"prompt": "Describe the types of research analysis you can perform."}).encode()
        )
        
        print(f"Response content type: {response.get('contentType', 'unknown')}")
        
        # Handle the streaming response
        if "text/event-stream" in response.get("contentType", ""):
            print("\n--- Streaming Response ---")
            content = []
            for line in response["response"].iter_lines(chunk_size=10):
                if line:
                    line = line.decode("utf-8")
                    if line.startswith("data: "):
                        data = line[6:]  # Remove "data: " prefix
                        print(f"Chunk: {data}")
                        content.append(data)
                    elif line.strip():  # Print non-empty lines
                        print(f"Event: {line}")
            print(f"\n--- Complete Response ---")
            print("\n".join(content))
        else:
            # Handle standard JSON response
            print("\n--- JSON Response ---")
            content = []
            for chunk in response.get("response", []):
                content.append(chunk.decode('utf-8'))
            result = json.loads(''.join(content))
            print(json.dumps(result, indent=2))
            
    except Exception as e:
        print(f"Error invoking agent: {e}")
        print(f"Error type: {type(e).__name__}")

if __name__ == "__main__":
    invoke_agent()

# agentcore invoke --session-id 6165f971-ceeb-4e66-9ed8-e2e78edba4e7
