from typing import List
import os
import google.generativeai as genai
from utils import retry_gemini

class PlannerAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"temperature": 0.3})

    @retry_gemini
    def run(self, query: str) -> List[str]:

        prompt = f"You are a research planner. Break this query into 4-5 specific research subtopics: {query}. Return as numbered list."
        response = self.model.generate_content(prompt)
        text = response.text
        # Parse numbered list
        lines = text.strip().split('\n')
        plan = []
        for line in lines:
            line = line.strip()
            if line and line[0].isdigit():
                # remove "1. " or "1) "
                plan.append(line.split(' ', 1)[-1].strip())
        return plan if plan else [query]

