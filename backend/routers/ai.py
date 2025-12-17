# routers/ai.py
from fastapi import APIRouter, HTTPException
import os
from openai import OpenAI 
from dotenv import load_dotenv
import json
from fastapi import APIRouter, Depends
from backend.db.models import User, Usage
from backend.routers.models import UserRequest, UserResponse, enhanceRequest, enhanceResponse
from backend.routers.auth import get_current_user
import re
from datetime import date
from sqlalchemy.orm import Session
from backend.db.database import get_db




def clean_json_string(json_string):
    # Remove any triple backtick blocks with optional json tag anywhere in the string
    cleaned_string = re.sub(r'```(?:json)?\s*([\s\S]*?)```', r'\1', json_string, flags=re.IGNORECASE)
    return cleaned_string.strip()

def extract_json(text):
    """
    Attempts to extract the first balanced JSON object from a string.
    """
    try:
        # This regex attempts to find the first {...} block (non-greedy)
        # It may not work for deeply nested objects but works for typical cases
        match = re.search(r'\{(?:[^{}]|(?R))*\}', text)
        if match:
            return match.group(0)
    except Exception:
        pass
    # Fallback: return original text if no match found
    return text


GENERATE_LIMIT_PER_DAY = 5

def get_or_create_today_usage(db: Session, username: str) -> Usage:
    today = date.today()
    usage = (
        db.query(Usage)
        .filter(Usage.username == username, Usage.date == today)
        .first()
    )
    if usage is None:
        usage = Usage(username=username, date=today, generate_count=0)
        db.add(usage)
        db.commit()
        db.refresh(usage)
    return usage


ai_router = APIRouter()

load_dotenv() 

@ai_router.post("/set_magic")
async def generate_story(user_request: UserRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> UserResponse:
    usage = get_or_create_today_usage(db, current_user.username)

    if usage.generate_count >= GENERATE_LIMIT_PER_DAY:
        raise HTTPException(
            status_code=429,
            detail=f"Daily limit of {GENERATE_LIMIT_PER_DAY} generations reached. Please come back tomorrow!",
        )
    final_prompt = f"""
Generate a branching interactive story with these specifications:

- THEME: {user_request.theme}
- MAIN CHARACTERS: {user_request.mainCharacters} (create at least this many distinct characters with names and brief traits)
- TOTAL EPISODES: {user_request.episodes} (create exactly this many episodes)
- CHOICES PER EPISODE: {user_request.choicesPerEpisode} (always 2 choices per episode except final episodes which have empty choices)
- TONE: {user_request.tone}
- SETTING: {user_request.setting}
- AUDIENCE: {user_request.audience} (make content appropriate for this age group)
- EMOJI USAGE: {user_request.emojis}
- SPECIAL REQUESTS: {user_request.specialRequests}
- ADDITIONAL INSTRUCTIONS: {user_request.additionalInstructions}

STRUCTURE REQUIREMENTS:

1. The story must be a JSON object with flat structure where each episode is a top-level key like "episode_1", "episode_2a", "episode_2b", "episode_3a", etc.
2. Each episode is an object containing:
   - "title": a short string title of the episode,
   - "story": a short descriptive text (no more than 100 words) for the episode,
   - "choices": an object whose keys are arbitrary choice IDs (e.g., "choice_1", "choice_2"),
     and whose values are objects with:
       - "text": the choice text shown to the user,
       - "leads_to": the episode ID string this choice leads to (e.g., "episode_2a").
3. Each non-final episode must have exactly 2 choices.
4. Final episodes (endings) must have empty choices: {{}}.
5. Episode naming should follow a binary or branching tree pattern, e.g.:
   episode_1, episode_2a, episode_2b, episode_3a, episode_3b, episode_3c, episode_3d, episode_4a, episode_4b, ..., etc.
6. Use double quotes for all JSON keys and string values.
7. Output ONLY the raw JSON object with no markdown, no explanations, no extra text.
8. The JSON response must start with '{{' and end with '}}' (single braces).

IMPORTANT: Strictly adhere to the user specifications above for number of episodes, choices per episode, naming conventions, and structure.
Do NOT nest full episode objects inside choices. Choices must only contain "text" and "leads_to" fields referencing top-level episodes.

EXAMPLE EPISODE STRUCTURE (for structure reference only):

{{
  "episode_1": {{
    "title": "The Whispering Lagoon 🏝️🔍",
    "story": "You, Maya (the curious photographer 📸), Leo (the inventor 🧪), and Zara (the historian 📜) arrive at the lagoon...",
    "choices": {{
      "choice_1": {{
        "text": "Investigate the stone spiral with Zara 🧐💎",
        "leads_to": "episode_2a"
      }},
      "choice_2": {{
        "text": "Follow the shoreline with Leo to find the source of the hum 🎵🌊",
        "leads_to": "episode_2b"
      }}
    }}
  }},
  "episode_2a": {{
    "title": "Glyphs in the Sand 📜🏖️",
    "story": "You and Zara kneel by the stones...",
    "choices": {{
      "choice_1": {{
        "text": "Explore the ancient carvings 🔍",
        "leads_to": "episode_3a"
      }},
      "choice_2": {{
        "text": "Return to camp to discuss findings 🏕️",
        "leads_to": "episode_3b"
      }}
    }}
  }},
  "episode_2b": {{
    "title": "Songs of the Shoreline 🌊🎶",
    "story": "Following Leo, you discover...",
    "choices": {{}}
  }},
  "episode_3a": {{
    "title": "Secrets Unveiled 🔐",
    "story": "The carvings reveal a hidden message...",
    "choices": {{}}
  }},
  "episode_3b": {{
    "title": "Campfire Tales 🔥",
    "story": "Back at camp, stories emerge...",
    "choices": {{}}
  }}
}}

"""

    client = OpenAI(api_key=os.getenv('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "You are a dynamic branching story generator that creates interactive stories based on user selections."},
                {"role": "user", "content": final_prompt}
            ],
            stream=False,
            temperature=1.3
        )
        
        content = response.choices[0].message.content
        print("Raw AI response:", content)  # Debug print
        
        content = clean_json_string(content)
        content = extract_json(content)
        
        story_json = json.loads(content)
        return UserResponse(story=story_json, error=None)
    except json.JSONDecodeError as e:
        return UserResponse(
            story={}, 
            error=f"Failed to parse JSON response: {str(e)}"
        )
    except Exception as e:
        return UserResponse(story={}, error=f"API call failed: {str(e)}")


@ai_router.post("/enhance")
async def enhance_story(passedStory: enhanceRequest, current_user: User = Depends(get_current_user)) -> enhanceResponse:
    prompt = '''You are an amazing short story enhancer including more live dialogues and increasing the word count of the story.
The desired output short story should have a creative short title with word count of 2000-3000 words. Based on the theme of the short story, include more live dialogues and subplots to increase the word count of the short story with more humanized LUCID and SIMPLE tone. Don't include Emojis.

Output ONLY the raw JSON object with no explanations, no markdown, or extra text.

OUTPUT STRUCTURE:
{
"title": "Story Title",
"story": "Enhanced Story Content"
}
'''

    client = OpenAI(api_key=os.getenv('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")
    
    try:
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": passedStory.story}
            ],
            stream=False,
            temperature=1.3
        )
        
        content = response.choices[0].message.content
        print("Raw AI response:", content)  # Debug print
        
        content = clean_json_string(content)
        content = extract_json(content)
        
        story_json = json.loads(content)
        return enhanceResponse(title=story_json["title"], enhancedStory=story_json["story"], error=None)
    except json.JSONDecodeError as e:
        return enhanceResponse(title="ERROR!!", enhancedStory=passedStory.story, error=f"Failed to parse JSON: {str(e)}")
    except Exception as e:
        return enhanceResponse(title="ERROR!!", enhancedStory=passedStory.story, error=f"API call failed: {str(e)}")
