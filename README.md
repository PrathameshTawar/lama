# CareerMentor AI 🤖

[![Hackathon Project](https://img.shields.io/badge/Hackathon-Project-blue.svg)](https://github.com/your-repo)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC.svg)](https://tailwindcss.com/)

> **Hackathon Winner Candidate** - An AI-powered career guidance platform that revolutionizes how professionals prepare for their next career move.

## 🚀 Hackathon Pitch

**Problem**: Traditional career coaching is expensive, time-consuming, and often inaccessible. Job seekers struggle with interview preparation, skill development, and career planning without personalized guidance.

**Solution**: CareerMentor AI provides instant, AI-powered career coaching with:
- **Personalized AI Chat**: Get career advice 24/7 from a Llama 4 powered mentor
- **Mock Interview Simulator**: Practice with real interview questions and get instant feedback
- **Career Dashboard**: Track progress, explore career paths, and manage learning goals
- **Voice Answers**: Speak your interview answers and get them transcribed in the browser

## ✨ Key Features

- 🤖 **AI Career Chat** - context-aware career coaching backed by Llama 4 (any OpenAI-compatible API)
- 🎯 **Mock Interview Practice** - answer by typing or by voice (browser speech-to-text) and get an AI score, strengths, improvements and key-point coverage
- 📊 **Career Dashboard** - skills, progress, career matches and a leaderboard
- 🔌 **Works offline** - with no API key (or no backend) the app falls back to built-in answers and heuristic scoring, so demos never break
- 📱 **Responsive, light/dark theme** - React + Tailwind + shadcn/ui

## 🛠️ Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # optional: add LLM_API_KEY for real AI answers
uvicorn main:app --reload   # http://localhost:8000  (docs at /docs)
```

### 2. Frontend (Vite + React)
```bash
npm install
npm run dev                 # http://localhost:8080 - /api is proxied to the backend
```

### Configuring the AI model
The backend talks to any OpenAI-compatible `/chat/completions` endpoint. Set these in `backend/.env`:

| Variable | Default | Notes |
|---|---|---|
| `LLM_API_KEY` | _(empty)_ | Empty = offline fallback mode. `CEREBRAS_API_KEY` is also accepted. |
| `LLM_BASE_URL` | `https://api.cerebras.ai/v1` | e.g. Groq, Together, OpenRouter, or a local vLLM/Ollama server |
| `LLM_MODEL` | `llama-4-scout-17b-16e-instruct` | Any chat model your provider serves |
| `CORS_ORIGINS` | localhost dev ports | Comma-separated |

For the frontend, set `VITE_API_URL` only if the API is on a different origin (see `.env.example`).

### Docker
```bash
docker compose up --build   # app at http://localhost (nginx routes /api to the backend)
```

## 🔗 API

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/api/health` | - | `{status, llm_enabled, model}` |
| POST | `/api/chat` | `{message, history: [{role, content}]}` | `{reply, source}` |
| POST | `/api/interview/feedback` | `{question, answer, expected_points[]}` | `{score, summary, strengths[], improvements[], covered_points[], source}` |

`source` is `"llm"` when the model answered and `"fallback"` when the built-in logic did.

## 🧪 Testing
```bash
cd backend && pip install -r requirements-dev.txt && pytest
npm run lint && npm run build
```

## 🏗️ Architecture

```
lama/
├── src/                      React + TypeScript frontend
│   ├── pages/                Index (landing + tabs), NotFound
│   ├── components/           Chat, MockInterview, Dashboard, Leaderboard, ...
│   └── lib/api.ts            Typed client for the backend
├── backend/                  FastAPI service
│   ├── app/main.py           Routes and request/response models
│   ├── app/llm.py            OpenAI-compatible LLM client
│   ├── app/fallback.py       Offline answers and heuristic scoring
│   └── tests/                pytest suite
├── experiments/              Standalone prototypes (Streamlit voice agent, local inference) - not used by the app
├── Dockerfile, nginx.conf    Frontend image
└── docker-compose.yml        Frontend + backend + reverse proxy
```

## 🤝 Contributing

We welcome contributions! This is a hackathon project, so feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow React best practices and hooks
- Add tests for new features
- Update documentation as needed

## 📈 Roadmap

- [x] Voice-based interview practice
- [ ] Generate interview questions per role with the LLM
- [ ] Streaming chat responses
- [ ] Real-time collaborative coaching sessions
- [ ] Integration with LinkedIn and job boards
- [ ] Advanced analytics and progress tracking
- [ ] Mobile app development
- [ ] Multi-language support

## 👥 Team

Built with ❤️ for hackathons and career development.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Ready to revolutionize career coaching?** ⭐ Star this repo and let's build the future of AI-powered career guidance together!
