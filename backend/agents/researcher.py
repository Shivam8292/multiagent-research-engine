from typing import List, Tuple
import os
from tavily import TavilyClient

class ResearcherAgent:
    def __init__(self):
        self.client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY") or "missing_key")

    def run(self, query: str, plan: List[str]) -> Tuple[str, List[str]]:
        try:
            response = self.client.search(query=query, max_results=8)
            results = response.get('results', [])
            
            raw_data = ""
            sources = []
            
            for res in results:
                title = res.get('title', '')
                content = res.get('content', '')
                url = res.get('url', '')
                
                raw_data += f"Title: {title}\nURL: {url}\nContent: {content}\n\n"
                if url:
                    sources.append(url)
                    
            return raw_data, list(set(sources))
        except Exception as e:
            print(f"Tavily search failed: {e}")
            return "", []

