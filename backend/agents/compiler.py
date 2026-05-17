from typing import List, Dict, Any
from ..models.schemas import ResearchReport

class CompilerAgent:
    def run(self, query: str, draft: str, feedback: Dict[str, Any], raw_data: str, sources: List[str]) -> ResearchReport:
        pass

