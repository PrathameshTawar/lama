import logging
from typing import Literal

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import fallback
from .config import Settings, get_settings
from .llm import LLMError, chat_completion, extract_json

logging.basicConfig(level=logging.INFO)

CHAT_SYSTEM_PROMPT = (
    "You are CareerMentor AI, a friendly and practical career coach. Give concise, actionable advice on careers, "
    "interviews, resumes, skill development and job searching. Use short paragraphs or bullet points. "
    "If a question is unrelated to careers or professional growth, briefly steer the user back."
)

FEEDBACK_SYSTEM_PROMPT = (
    "You are an expert interviewer evaluating a candidate's answer. Respond ONLY with a JSON object with keys: "
    '"score" (integer 0-100), "summary" (one sentence), "strengths" (array of short strings), '
    '"improvements" (array of short strings), "covered_points" (array containing the expected points the answer covered, copied verbatim).'
)

settings = get_settings()
app = FastAPI(title="CareerMentor AI API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatTurn] = Field(default_factory=list, max_length=20)


class ChatResponse(BaseModel):
    reply: str
    source: Literal["llm", "fallback"]


class FeedbackRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    answer: str = Field(min_length=1, max_length=8000)
    expected_points: list[str] = Field(default_factory=list, max_length=20)


class FeedbackResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    summary: str
    strengths: list[str]
    improvements: list[str]
    covered_points: list[str]
    source: Literal["llm", "fallback"]


@app.get("/")
@app.get("/api/health")
def health(cfg: Settings = Depends(get_settings)):
    return {"status": "ok", "llm_enabled": cfg.llm_enabled, "model": cfg.llm_model if cfg.llm_enabled else None}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, cfg: Settings = Depends(get_settings)):
    messages = [{"role": "system", "content": CHAT_SYSTEM_PROMPT}]
    messages += [turn.model_dump() for turn in req.history]
    messages.append({"role": "user", "content": req.message})
    try:
        return ChatResponse(reply=await chat_completion(cfg, messages), source="llm")
    except LLMError:
        return ChatResponse(reply=fallback.chat_reply(req.message), source="fallback")


@app.post("/api/interview/feedback", response_model=FeedbackResponse)
async def interview_feedback(req: FeedbackRequest, cfg: Settings = Depends(get_settings)):
    prompt = (
        f"Question: {req.question}\n\nExpected points:\n"
        + "\n".join(f"- {p}" for p in req.expected_points)
        + f"\n\nCandidate answer:\n{req.answer}"
    )
    messages = [{"role": "system", "content": FEEDBACK_SYSTEM_PROMPT}, {"role": "user", "content": prompt}]
    try:
        data = extract_json(await chat_completion(cfg, messages, temperature=0.2))
        return FeedbackResponse(
            score=max(0, min(int(data["score"]), 100)),
            summary=str(data.get("summary", "")),
            strengths=[str(s) for s in data.get("strengths", [])],
            improvements=[str(s) for s in data.get("improvements", [])],
            covered_points=[p for p in data.get("covered_points", []) if p in req.expected_points],
            source="llm",
        )
    except (LLMError, KeyError, TypeError, ValueError):
        return FeedbackResponse(**fallback.interview_feedback(req.question, req.answer, req.expected_points), source="fallback")
