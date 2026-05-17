# Pydantic models
from pydantic import BaseModel
from typing import List

class ResearchRequest(BaseModel):
    query: str

class AgentStatus(BaseModel):
    name: str
    status: str
    output: str

class ReportSection(BaseModel):
    title: str
    content: str

class ResearchReport(BaseModel):
    query: str
    summary: str
    sections: List[ReportSection]
    sources: List[str]
    agents: List[AgentStatus]
    created_at: str
