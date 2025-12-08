# routers/ai.py
from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI 
from dotenv import load_dotenv
# Import the new union types
from db.models import AIRequest, AISuccess 

ai_router = APIRouter()

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1",
)

@ai_router.post("/setmagic", response_model=AISuccess)
async def set_magic(request: AIRequest) -> AISuccess:
    try:
        messages = [
            {"role": "user", "content": request.prompt}
        ]

        completion = client.chat.completions.create(
            model=request.model,
            messages=messages,
            temperature=0.7,
        )

        response_content = completion.choices[0].message.content

        # Returns AISuccess model
        return {"response": response_content}

    except Exception as e:
        # On failure, raise an HTTPException instead of returning a tuple (dict, status code)
        raise HTTPException(status_code=500, detail=f"DeepSeek API Error: {str(e)}")