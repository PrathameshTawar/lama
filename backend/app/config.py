import os
from dataclasses import dataclass, field

from dotenv import load_dotenv

load_dotenv()


def _split(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    # Any OpenAI-compatible chat completions API works (Cerebras, Groq, Together, OpenRouter, a local vLLM/Ollama...).
    llm_api_key: str = field(default_factory=lambda: os.getenv("LLM_API_KEY") or os.getenv("CEREBRAS_API_KEY", ""))
    llm_base_url: str = field(default_factory=lambda: os.getenv("LLM_BASE_URL", "https://api.cerebras.ai/v1"))
    llm_model: str = field(default_factory=lambda: os.getenv("LLM_MODEL", "llama-4-scout-17b-16e-instruct"))
    llm_timeout: float = field(default_factory=lambda: float(os.getenv("LLM_TIMEOUT", "30")))
    cors_origins: list[str] = field(
        default_factory=lambda: _split(
            os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:8080,http://localhost:3000")
        )
    )

    @property
    def llm_enabled(self) -> bool:
        return bool(self.llm_api_key)


def get_settings() -> Settings:
    return Settings()
