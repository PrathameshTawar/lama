const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type Source = "llm" | "fallback";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  reply: string;
  source: Source;
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  covered_points: string[];
  source: Source;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const sendChatMessage = (message: string, history: ChatTurn[]) =>
  post<ChatResponse>("/api/chat", { message, history });

export const getInterviewFeedback = (question: string, answer: string, expectedPoints: string[]) =>
  post<InterviewFeedback>("/api/interview/feedback", { question, answer, expected_points: expectedPoints });
