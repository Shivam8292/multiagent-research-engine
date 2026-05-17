from typing import List, Dict, Any
from datetime import datetime
import os
import google.generativeai as genai
from models.schemas import ResearchReport, ReportSection, AgentStatus
from utils import retry_gemini

class CompilerAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"temperature": 0.3})

    @retry_gemini
    def run(self, query: str, draft: str, feedback: Dict[str, Any], raw_data: str, sources: List[str]) -> ResearchReport:

        prompt = f"""Improve this research draft based on this feedback: {feedback}
Original draft: {draft}
Return improved version in same markdown format."""
        
        response = self.model.generate_content(prompt)
        improved_draft = response.text
        
        # Parse sections
        parts = improved_draft.split('##')
        summary = ""
        sections = []
        
        for i, part in enumerate(parts):
            part = part.strip()
            if not part:
                continue
            if i == 0 and not improved_draft.startswith('##'):
                summary = part
            else:
                lines = part.split('\n', 1)
                title = lines[0].strip()
                content = lines[1].strip() if len(lines) > 1 else ""
                
                # If it's the very first part and no summary exists yet, maybe extract the first paragraph of content as summary
                if not summary and i == 1:
                    content_parts = content.split('\n\n', 1)
                    summary = content_parts[0]
                    content = content_parts[1] if len(content_parts) > 1 else content
                
                sections.append(ReportSection(title=title, content=content))
        
        # fallback summary
        if not summary and sections:
            summary = sections[0].content[:200] + "..."
            
        agents_status = [
            AgentStatus(name="Planner", status="done", output="Generated plan"),
            AgentStatus(name="Researcher", status="done", output="Fetched data"),
            AgentStatus(name="Writer", status="done", output="Wrote draft"),
            AgentStatus(name="Critic", status="done", output=f"Score: {feedback.get('score')} - {feedback.get('feedback')}"),
            AgentStatus(name="Compiler", status="done", output="Compiled final report")
        ]
        
        return ResearchReport(
            query=query,
            summary=summary,
            sections=sections,
            sources=sources,
            agents=agents_status,
            created_at=datetime.utcnow().isoformat()
        )

