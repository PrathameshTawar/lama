# Contributing to CareerMentor AI 🤝

Welcome to the CareerMentor AI hackathon project! We're excited to have you contribute to this AI-powered career guidance platform.

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ with pip
- Git

### Setup in 3 Steps
```bash
# 1. Clone and setup frontend
git clone <YOUR_GIT_URL>
cd wise-career-ai-main
npm install

# 2. Setup backend (in new terminal)
cd backend
pip install -r requirements.txt

# 3. Start both services
# Terminal 1: npm run dev (frontend at http://localhost:5173)
# Terminal 2: uvicorn main:app --reload (backend at http://localhost:8000)
```

## 🏆 Hackathon Challenges

### Current Challenges
- [ ] **AI Integration**: Connect frontend chat to real backend API
- [ ] **Voice Features**: Add voice input/output for interviews
- [ ] **Real-time Collaboration**: Multi-user interview sessions
- [ ] **Analytics Dashboard**: Advanced career tracking metrics
- [ ] **Mobile Optimization**: PWA support and mobile-first design

### Feature Ideas
- Resume builder with AI suggestions
- Job matching algorithm
- Skill assessment quizzes
- Mentor matching system
- Career path visualization

## 📋 Development Guidelines

### Code Style
- **TypeScript**: Strict typing for all new code
- **React**: Functional components with hooks
- **Python**: Type hints and docstrings
- **Naming**: camelCase for JS/TS, snake_case for Python

### Commit Messages
```
feat: add voice recording to mock interviews
fix: resolve CORS issue in backend API
docs: update setup instructions
hack: temporary demo endpoint for judging
```

### Testing
- Frontend: Manual testing in browser
- Backend: Test API endpoints with curl/Postman
- Integration: Full flow testing (chat → interview → dashboard)

## 🔧 API Endpoints

### Backend (`http://localhost:8000`)
- `GET /` - API status and available endpoints
- `GET /demo` - Sample career advice data
- `POST /finetune` - Upload training data for AI fine-tuning

### Frontend Routes
- `/` - Main application with all features
- Navigation between Chat, Interview, and Dashboard tabs

## 🎯 Judging Criteria Focus

To maximize hackathon scores, focus on:
- **Innovation**: AI fine-tuning capabilities
- **User Experience**: Intuitive interface and smooth interactions
- **Technical Complexity**: Full-stack implementation with modern tech
- **Presentation**: Clear README and demo flow
- **Scalability**: Well-structured, maintainable code

## 📞 Getting Help

- **Issues**: Open GitHub issues for bugs/features
- **Discussions**: Use GitHub Discussions for ideas
- **Code Reviews**: All PRs need review before merge

## 🏅 Recognition

Contributors will be recognized in:
- README.md contributors section
- Project presentation slides
- Future development roadmap

---

**Happy hacking!** Let's build the future of AI-powered career coaching together! 🚀

*Built for [Hackathon Name] - [Date]*
