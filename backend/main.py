import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models.schemas import ResearchRequest, ResearchReport, AgentStatus
from agents.planner import PlannerAgent
from agents.researcher import ResearcherAgent
from agents.writer import WriterAgent
from agents.critic import CriticAgent
from agents.compiler import CompilerAgent


load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

planner = PlannerAgent()
researcher = ResearcherAgent()
writer = WriterAgent()
critic = CriticAgent()
compiler = CompilerAgent()

@app.get("/")
def read_root():
    return {"message": "Welcome to ResearchMind API"}

@app.get("/health")
def health_check():
    # Phase 5: Check API keys on startup/health
    if not os.getenv("GEMINI_API_KEY") or not os.getenv("TAVILY_API_KEY"):
        return {"status": "error", "message": "API keys missing"}
    return {"status": "ok"}

@app.post("/research", response_model=ResearchReport)
async def run_research(request: ResearchRequest):
    try:
        # Pipeline execution
        plan = planner.run(request.query)
        raw_data, sources = researcher.run(request.query, plan)
        draft = writer.run(request.query, plan, raw_data)
        critic_res = critic.run(draft)
        report = compiler.run(request.query, draft, critic_res, raw_data, sources)
        
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
