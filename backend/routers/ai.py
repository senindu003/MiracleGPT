# routers/ai.py
from fastapi import APIRouter
import os
from openai import OpenAI 
from dotenv import load_dotenv
import json
from db.models import UserRequest, UserResponse
# Import the new union types


ai_router = APIRouter()

load_dotenv() 

story_generator_prompt = {
    "system_role": "You are a dynamic branching story generator that creates interactive stories based on user selections from a web form. All parameters are variable and provided through the user's form selections.",
    
    "available_options": {
        "note": "These are the exact options available in the user's form. Values will come from these arrays.",
        "theme": [
            "Fantasy 🧙‍♂️", "Science Fiction 🚀", "Mystery 🕵️‍♀️", "Romance 💕", 
            "Adventure 🏞️", "Horror 👻", "Historical 🏰", "Comedy 😂", 
            "Drama 🎭", "Thriller 🔪"
        ],
        "mainCharacters": ["1", "2", "3", "4"],
        "episodes": ["2", "3", "4"],
        "wordsPerEpisode": ["50-100", "100-150", "150-200", "200-250"],
        "choicesPerEpisode": ["2"],
        "tone": [
            "Lucid 😊", "Dramatic 🎭", "Mysterious 🕵️‍♂️", "Dark / Gothic 🌑", 
            "Humorous 😂", "Inspirational 🌟", "Emotional 💔", "Suspenseful 😰"
        ],
        "setting": [
            "Medieval Kingdom 🏰", "Futuristic City 🌆", "Haunted House 👻", 
            "Space Station 🛰️", "Enchanted Forest 🌲", "Post-Apocalyptic Wasteland ☢️", 
            "Tropical Island 🏝️", "Small Town 🏡"
        ],
        "audience": [
            "Children (ages 5-12)",
            "Teens (ages 13-18)", 
            "Adults (18+)",
            "All Ages"
        ],
        "emojis": ["Yes, use liberally 🎉✨", "Use sparingly 🙂", "No emojis ❌"],
        "specialRequests": [
            "None", "No violence 🚫🔫", "Focus on friendship 🤝", 
            "Include mystery elements 🔍", "Avoid horror elements 👻❌", 
            "Include romance 💕", "Emphasize humor 😂", "Custom (enter in prompt below)"
        ]
    },
    
    "api_input_format": {
        "note": "The user's request will come in this exact JSON format from the frontend",
        "expected_request_structure": {
            "theme": "string from theme array (e.g., 'Fantasy 🧙‍♂️')",
            "mainCharacters": "string from mainCharacters array (e.g., '3')",
            "episodes": "string from episodes array (e.g., '4')",
            "wordsPerEpisode": "string from wordsPerEpisode array (e.g., '200-250')",
            "choicesPerEpisode": "string from choicesPerEpisode array (always '2')",
            "tone": "string from tone array (e.g., 'Suspenseful 😰')",
            "setting": "string from setting array (e.g., 'Haunted House 👻')",
            "audience": "string from audience array (e.g., 'Teens (ages 13-18)')",
            "emojis": "string from emojis array (e.g., 'Yes, use liberally 🎉✨')",
            "specialRequests": "string from specialRequests array",
            "additionalInstructions": "string (optional user text input)"
        },
        "example_request": {
            "theme": "Fantasy 🧙‍♂️",
            "mainCharacters": "3",
            "episodes": "4",
            "wordsPerEpisode": "200-250",
            "choicesPerEpisode": "2",
            "tone": "Suspenseful 😰",
            "setting": "Haunted House 👻",
            "audience": "Teens (ages 13-18)",
            "emojis": "Yes, use liberally 🎉✨",
            "specialRequests": "Include mystery elements 🔍",
            "additionalInstructions": "Make it spooky but not too scary"
        }
    },
    
    "generation_rules": {
        "episode_count": {
            "rule": "Create EXACTLY the number of episodes specified (2, 3, or 4)",
            "note": "Since episodes only has options 2, 3, 4, keep story compact",
            "structure": {
                "2_episodes": "episode_1 → episode_2 (endings in episode_2)",
                "3_episodes": "episode_1 → episode_2 → episode_3 (endings in episode_3)",
                "4_episodes": "episode_1 → episode_2 → episode_3 → episode_4 (endings in episode_4)"
            }
        },
        "choices_count": {
            "rule": "ALWAYS 2 choices per episode (since choicesPerEpisode always = '2')",
            "note": "Create meaningful binary choices that branch the story"
        },
        "characters": {
            "rule": "Create at least the specified number of main characters",
            "note": "From options: 1, 2, 3, or 4 characters minimum"
        },
        "word_count": {
            "rule": "Match the wordsPerEpisode range exactly",
            "ranges": {
                "50-100": "Very concise, fast-paced",
                "100-150": "Moderate detail",
                "150-200": "Good detail and development",
                "200-250": "Rich, detailed storytelling"
            }
        },
        "emoji_usage": {
            "rules": {
                "Yes, use liberally 🎉✨": "Use 2-4 emojis per title, 1-2 per choice text",
                "Use sparingly 🙂": "Use 0-1 emojis in titles, none in choices",
                "No emojis ❌": "No emojis anywhere"
            }
        },
        "audience_appropriateness": {
            "Children (ages 5-12)": "Simple language, positive messages, minimal conflict",
            "Teens (ages 13-18)": "More complex themes, relationships, moderate conflict",
            "Adults (18+)": "Mature themes, complex characters, nuanced conflicts",
            "All Ages": "Universal themes, avoid mature content, positive resolution"
        },
        "special_requests": {
            "processing": "Always incorporate specialRequests into the story",
            "examples": {
                "No violence 🚫🔫": "Resolve conflicts through dialogue, puzzles, or escape",
                "Focus on friendship 🤝": "Emphasize character bonds and cooperation",
                "Include mystery elements 🔍": "Add clues, secrets, revelations",
                "Avoid horror elements 👻❌": "Keep tone light even in spooky settings",
                "Include romance 💕": "Add relationship development",
                "Emphasize humor 😂": "Add comedic elements and funny situations"
            }
        }
    },
    
    "story_structure": {
        "required_format": "Deeply nested JSON where episodes are inside choice objects",
        "example_mini_structure": {
            "episode_1": {
                "title": "Title with appropriate emojis",
                "story": "Story text matching word count and tone",
                "choices": {
                    "Choice A title with emojis": {
                        "episode_2a": {
                            "title": "Next episode title",
                            "story": "Continuing story",
                            "choices": "Either more episodes or empty {} for ending"
                        }
                    },
                    "Choice B title with emojis": {
                        "episode_2b": {
                            "title": "Alternative episode title",
                            "story": "Alternative story path",
                            "choices": "{} for ending or more episodes"
                        }
                    }
                }
            }
        },
        "nesting_depth": "Based on episodes count: 2 episodes = 1 level deep, 3 episodes = 2 levels, 4 episodes = 3 levels"
    },
    
    "content_adaptation_matrix": {
        "theme_adaptations": {
            "Fantasy 🧙‍♂️": "Include magic, mythical creatures, quests, medieval elements",
            "Science Fiction 🚀": "Include technology, space, futuristic elements, aliens",
            "Mystery 🕵️‍♀️": "Include clues, suspects, investigations, revelations",
            "Romance 💕": "Focus on relationships, emotions, connections",
            "Adventure 🏞️": "Include exploration, danger, discovery, action",
            "Horror 👻": "Include fear, suspense, supernatural, psychological elements",
            "Historical 🏰": "Include period details, historical accuracy, cultural elements",
            "Comedy 😂": "Include humor, funny situations, witty dialogue",
            "Drama 🎭": "Focus on character development, emotional conflicts",
            "Thriller 🔪": "Include suspense, danger, high stakes, tension"
        },
        "tone_adaptations": {
            "Lucid 😊": "Clear, vivid, emotionally resonant, hopeful",
            "Dramatic 🎭": "Intense emotions, high stakes, theatrical",
            "Mysterious 🕵️‍♂️": "Puzzling, enigmatic, slow reveals",
            "Dark / Gothic 🌑": "Brooding, atmospheric, melancholic",
            "Humorous 😂": "Funny, lighthearted, witty, playful",
            "Inspirational 🌟": "Uplifting, motivational, positive",
            "Emotional 💔": "Heartfelt, sentimental, touching",
            "Suspenseful 😰": "Tense, anxious, cliffhangers"
        }
    },
    
    "output_requirements": {
        "format": "ONLY valid Python Dict object, starting with { and ending with }",
        "no_wrappers": "Do not wrap in markdown, code blocks, or additional text",
        "structure": "Must match the deeply nested episodes-inside-choices pattern",
        "episode_count": f"Must have EXACTLY the number specified in 'episodes' (2, 3, or 4)",
        "character_count": "Must include at least the specified number of main characters",
        "word_count": "Each story section must fit within the specified word range",
        "emoji_compliance": "Follow emoji usage rules based on user selection",
        "audience_appropriate": "Content must be suitable for the specified audience",
        "special_requests": "Must incorporate any special requests fully"
    },
    
    "generation_template": """
Generate a branching interactive story with these specifications:
- THEME: {theme}
- MAIN CHARACTERS: {mainCharacters} (create at least this many distinct characters)
- TOTAL EPISODES: {episodes} (create exactly this many episodes)
- WORDS PER EPISODE: {wordsPerEpisode} (each story section must fit this range)
- CHOICES PER EPISODE: {choicesPerEpisode} (always 2 choices per episode)
- TONE: {tone}
- SETTING: {setting}
- AUDIENCE: {audience} (make content appropriate for this age group)
- EMOJI USAGE: {emojis}
- SPECIAL REQUESTS: {specialRequests}
- ADDITIONAL INSTRUCTIONS: {additionalInstructions}

STRUCTURE REQUIREMENTS:
1. Create exactly {episodes} episodes total
2. Each episode has exactly 2 choices (except final episodes which have empty {{}})
3. Use deep nesting: episodes are contained within choice objects
4. Episode naming: episode_1, episode_2a, episode_2b, episode_3a, etc.
5. All endings (final episodes) must have empty choices: {{}}

IMPORTANT: Output ONLY the raw JSON object, no markdown code blocks, no explanations, no additional text.
The response should start with '{{' and end with '}}'.
"""
}

# When receiving request from your frontend
@ai_router.post("/set_magic")
async def generate_story(user_request: UserRequest)-> UserResponse:
    # Construct the prompt using the template
    final_prompt = f"""
Generate a branching interactive story with these specifications:
- THEME: {user_request.theme}
- MAIN CHARACTERS: {user_request.mainCharacters} (create at least this many distinct characters)
- TOTAL EPISODES: {user_request.episodes} (create exactly this many episodes)
- WORDS PER EPISODE: {user_request.wordsPerEpisode} (each story section must fit this range)
- CHOICES PER EPISODE: {user_request.choicesPerEpisode} (always 2 choices per episode)
- TONE: {user_request.tone}
- SETTING: {user_request.setting}
- AUDIENCE: {user_request.audience} (make content appropriate for this age group)
- EMOJI USAGE: {user_request.emojis}
- SPECIAL REQUESTS: {user_request.specialRequests}
- ADDITIONAL INSTRUCTIONS: {user_request.additionalInstructions}

STRUCTURE REQUIREMENTS:
1. Create exactly {user_request.episodes} episodes total
2. Each episode has exactly 2 choices (except final episodes which have empty {{}})
3. Use deep nesting: episodes are contained within choice objects
4. Episode naming: episode_1, episode_2a, episode_2b, episode_3a, etc.
5. All endings (final episodes) must have empty choices: {{}}

IMPORTANT: Output ONLY the raw JSON object, no markdown code blocks, no explanations, no additional text.
The response should start with '{{' and end with '}}'.
"""
    
    client = OpenAI(api_key=os.getenv('DEEPSEEK_API_KEY'), base_url="https://api.deepseek.com")
    
    try:
          response = client.chat.completions.create(
              model="deepseek-chat",
              messages=[
                  {"role": "system", "content": "You are a dynamic branching story generator that creates interactive stories based on user selections."},
                  {"role": "user", "content": final_prompt}
              ],
              stream=False
          )
          
          # Get the response content
          content = response.choices[0].message.content
          
          # Try to parse the JSON string
          try:
              story_json = json.loads(content)
              return UserResponse(story=story_json, error=None)
          except json.JSONDecodeError as e:
              # If parsing fails, return error
              return UserResponse(
                  story={}, 
                  error=f"Failed to parse JSON response: {str(e)}"
              )
              
    except Exception as e:
        return UserResponse(story={}, error=f"API call failed: {str(e)}")