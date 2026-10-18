import json
import logging
import re

import httpx

from .config import Settings

logger = logging.getLogger(__name__)


class LLMError(RuntimeError):
    pass


async def chat_completion(settings: Settings, messages: list[dict], temperature: float = 0.7, max_tokens: int = 700) -> str:
    """Call an OpenAI-compatible /chat/completions endpoint and return the reply text."""
    if not settings.llm_enabled:
        raise LLMError("No LLM API key configured")

    url = settings.llm_base_url.rstrip("/") + "/chat/completions"
    payload = {
        "model": settings.llm_model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    headers = {"Authorization": f"Bearer {settings.llm_api_key}"}
    try:
        async with httpx.AsyncClient(timeout=settings.llm_timeout) as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()
    except (httpx.HTTPError, KeyError, IndexError, ValueError) as exc:
        logger.warning("LLM request failed: %s", exc)
        raise LLMError(str(exc)) from exc


def extract_json(text: str) -> dict:
    """Pull the first JSON object out of a model reply (models often wrap JSON in prose or code fences)."""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise LLMError("Model reply contained no JSON object")
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError as exc:
        raise LLMError(f"Invalid JSON from model: {exc}") from exc
