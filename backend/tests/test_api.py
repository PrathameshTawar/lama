import pytest
from fastapi.testclient import TestClient

from app.config import Settings, get_settings
from app.main import app


@pytest.fixture()
def client():
    app.dependency_overrides[get_settings] = lambda: Settings(llm_api_key="")
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok", "llm_enabled": False, "model": None}


def test_chat_falls_back_without_llm(client):
    res = client.post("/api/chat", json={"message": "How do I prepare for an interview?"})
    assert res.status_code == 200
    body = res.json()
    assert body["source"] == "fallback"
    assert "interview" in body["reply"].lower()


def test_chat_rejects_empty_message(client):
    assert client.post("/api/chat", json={"message": ""}).status_code == 422


def test_feedback_fallback_scores_coverage(client):
    points = ["INNER JOIN - returns matching records", "LEFT JOIN - all from left table + matches"]
    weak = client.post(
        "/api/interview/feedback", json={"question": "Explain JOINs", "answer": "Not sure.", "expected_points": points}
    ).json()
    strong = client.post(
        "/api/interview/feedback",
        json={
            "question": "Explain JOINs",
            "answer": "An INNER JOIN returns only matching records from both tables. A LEFT JOIN returns all rows "
            "from the left table plus matches from the right; I used it in 2 reporting projects.",
            "expected_points": points,
        },
    ).json()
    assert weak["source"] == strong["source"] == "fallback"
    assert strong["score"] > weak["score"]
    assert strong["covered_points"] == points
    assert weak["covered_points"] == []


def test_feedback_uses_llm_json(client, monkeypatch):
    async def fake_completion(*_args, **_kwargs):
        return 'Here you go:\n```json\n{"score": 82, "summary": "Good", "strengths": ["Clear"], ' \
               '"improvements": ["Add metrics"], "covered_points": ["A", "Z"]}\n```'

    monkeypatch.setattr("app.main.chat_completion", fake_completion)
    res = client.post("/api/interview/feedback", json={"question": "Q", "answer": "Ans", "expected_points": ["A", "B"]})
    body = res.json()
    assert body["source"] == "llm"
    assert body["score"] == 82
    assert body["covered_points"] == ["A"]  # points the model invented are dropped
