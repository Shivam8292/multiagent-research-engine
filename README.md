# Multi-Agent Deep Research System

ResearchMind - Type a topic. Get a full research report in minutes.

## Setup

### 1. Free API Keys
- Get Gemini API Key from Google AI Studio (https://aistudio.google.com/app/apikey)
- Get Tavily API Key from Tavily (https://tavily.com)

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Create a `.env` file in the `backend/` directory:
```
GEMINI_API_KEY=your_gemini_key
TAVILY_API_KEY=your_tavily_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Screenshots
*(Coming soon)*
