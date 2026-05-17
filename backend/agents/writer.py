from typing import List
import os
import google.generativeai as genai
from utils import retry_gemini

class WriterAgent:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel("gemini-2.5-flash", generation_config={"temperature": 0.7})

    @retry_gemini
    def run(self, query: str, plan: List[str], raw_data: str) -> str:

        prompt = f"""You are an expert research writer. Based on this research data: {raw_data}
Write a detailed research report on: {query}
Cover these sections: {plan}
For each section write 2-3 detailed paragraphs.
Use markdown formatting with ## for section headers."""
        
        response = self.model.generate_content(prompt)
        return response.text

