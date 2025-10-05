from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend skeleton running"}

@app.post("/api/generate")
def generate_text(req: PromptRequest):
    return {"response": f"This is a placeholder response to: {req.prompt}"}
