from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from pydantic import BaseModel, Field

import aiohttp
import asyncio
import logging
import os
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
MODEL_NAME = os.getenv("MODEL_NAME", "llama3")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "500"))

class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1, max_length=2000)

class ChatRequest(BaseModel):
    messages: list[Message] = Field(..., min_items=1, max_items=20)

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    model_used: str

def build_prompt(messages: list[Message]):
    system_instruction = (
        "You are a professional medical AI Agent."
        "Only respond to medical questions related to symptoms, diagnosis, and treatments."
        "You are allowed to ask for more information such as blood tests, stool tests, or other tests."
        "If the input is unrelated to medicine, politely inform the user that you cannot help."
        "Do not start every response with a disclaimer."
    )

    chat = [f"System: {system_instruction}"]
    
    for message in messages[-10:]:
        role = "Human" if message.role == "user" else "Assistant"
        content = message.content.replace("System:", "").replace("Assistant:", "").replace("Human:", "")
        chat.append(f"{role}: {content}")
    
    return "\n".join(chat) + "\nAssistant:"

async def call_ollama_api(prompt: str) -> str:
    try:
        async with aiohttp.ClientSession() as session:
            payload = {
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "top_p": 0.9,
                    "num_predict": MAX_TOKENS
                }
            }
            
            async with session.post(
                f"{OLLAMA_URL}/api/generate",
                json=payload,
                timeout=aiohttp.ClientTimeout(total=30)
            ) as response:
                if response.status != 200:
                    raise HTTPException(
                        status_code = 500,
                        detail=f"Model API returned status {response.status}"
                    )
                
                result = await response.json()
                return result.get("response", "No response from model")
    except aiohttp.ClientError as e:
        logger.error(f"API call failed: {e}")
        raise HTTPException(
            status_code=503,
            detail="Medical AI service temporarily unavailable"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )
    
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health_check():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{OLLAMA_URL}/api/tags") as response:
                if response.status == 200:
                    return {"status": "healthy", "model_service": "available"}
                else:
                    return {"status": "degraded", "model_service": "unavailable"}
    except:
        return {"status": "unhealthy", "model_service": "unavailable"}
    
@app.post("/diagnose", response_model=ChatResponse)
async def diagnose(req: ChatRequest):
    try:
        logger.info(f"Processing medical query with {len(req.messages)} messages")

        prompt = build_prompt(req.messages)

        response_text = await call_ollama_api(prompt)

        disclaimer = "\n\nIMPORTANT: This tool is not meant to diagnose or treat. It is only meant to assist." \
        " Always make sure to consult a qualified healthcare professional for any medical advice, diagnosis, or treatment."

        response_text += disclaimer

        return ChatResponse(
            response=response_text,
            timestamp=datetime.now(),
            model_used=MODEL_NAME
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in diagnose endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to process medical query"
        )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return HTTPException(
        status_code=500,
        detail="An unexpected error occured"
    )

if __name__ =="__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)