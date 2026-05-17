import time

def retry_gemini(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"Gemini call failed: {e}. Retrying in 2 seconds...")
            time.sleep(2)
            return func(*args, **kwargs)
    return wrapper
