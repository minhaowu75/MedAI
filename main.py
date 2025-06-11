from fastapi import FastAPI, Request
import requests

app = FastAPI()

@app.get("/")
async def root():
    return {"Hello": "World"}

