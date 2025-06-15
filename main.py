from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from pydantic import BaseModel

import requests

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]

def build_prompt(messages: list[Message]):
    system_instruction = (
        "You are a professional medical AI Agent."
        "Only respond to medical questions related to symptoms, diagnosis, and treatments."
        "You are allowed to ask for more information such as blood tests, stool tests, or other tests."
        "If the input is unrelated to medicine, politely inform the user that you cannot help."
        "Do not start every response with a disclaimer."
    )

    chat = [f"System: {system_instruction}"]
    for message in messages:
        pref = "User" if message.role == "user" else "Assistant"
        chat.append(f"{pref}: {message.content}")
    
    return "\n".join(chat) + "\nAssistant:"

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/diagnose")
def diagnose(req: ChatRequest):
    prompt = build_prompt(req.messages)

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3",
            "prompt": prompt,
            "stream": False,
            "temperature": 0.7
        }
    )

    result = response.json()
    return {"response": result.get("response", "Model did not respond.")}