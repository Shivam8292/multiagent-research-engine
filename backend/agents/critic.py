from typing import Dict, Any
import os
import json
import google.generativeai as genai
from ..utils import retry_gemini

class CriticAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-1.5-flash", generation_config={"temperature": 0.3})

    @retry_gemini
    def run(self, draft: str) -> Dict[str, Any]:

        prompt = f"""Review this research report and give:
1. Quality score out of 10
2. What is missing or could be improved
Report: {draft}
Respond ONLY in JSON format: {{"score": 8, "feedback": "Needs more details..."}}"""
        
        try:
            response = self.model.generate_content(prompt)
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
            
            return json.loads(text)
        except Exception as e:
            print(f"Critic parsing failed: {e}")
            return {"score": 5, "feedback": "Could not parse critic feedback."}

