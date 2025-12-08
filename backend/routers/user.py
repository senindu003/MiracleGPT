# routers/user.py
from fastapi import APIRouter, HTTPException
import json
# Import the client and the models from their respective files
from routers.ai import client 
from db.models import UserRequest, UserResponse, AISuccess, AIError 

user_router = APIRouter()

@user_router.post("/userpromptreceived", response_model=UserResponse)
async def user_prompt_received(user_prompt: UserRequest) -> UserResponse:
    # 1. FIX INTERPOLATION: Get user data as a JSON string
    user_inputs_json_string = user_prompt.model_dump_json()

    # 2. Define the prompt structure as a Python dictionary
    prompt_dict = {
        "instructions": "You will be provided with user inputs specifying the story parameters. Use these inputs to generate a fully nested, branching interactive story JSON compatible with a React Episodes component that expects episodes nested inside choices. Engage the user-provided parameters carefully and tailor the story structure accordingly.",
        
        "user_inputs": user_inputs_json_string, # Correctly injects the user's data
        
        "generation_requirements": {
            "story_format": "JSON",
            "episode_structure": {
                "episode_id": {
                    "title": "String with emojis if enabled",
                    "story": "String with vivid imagery and emotional depth, matching words_per_episode",
                    "choices": {
                        "<choice_text>": {
                            "<next_episode_id>": { #full nested episode object 
                                }
                        }
                    }
                }
            },
            "constraints": [
                "Use exactly the number of total_episodes and choices_perEpisode as specified by the user",
                "Episode IDs must be unique and follow a logical pattern (e.g., episode_1, episode_2b, episode_3c, etc.)",
                "Fully nest each next episode inside the choice that leads to it",
                "Endings have empty choices {}",
                "Use vivid, immersive storytelling with emotional depth",
                "Use emojis liberally if user requested"
            ]
        },
        "example_binary_tree_mermaid": "```mermaid\ngraph TD\n  E1[episode_1] ...",
        "note_to_model": "Adapt the example binary tree above to match the exact number of episodes and choices per episode specified by the user. The JSON output must strictly follow the nested episode-inside-choice pattern shown. Do not hardcode episode counts or choices; always use the user inputs to generate the branching structure."
    }

    # 3. Convert dictionary to the final JSON string for the LLM
    final_prompt_string = json.dumps(prompt_dict, indent=2)

    # 4. CALL THE DEEPSEEK API
    try:
        messages = [{"role": "user", "content": final_prompt_string}]
        
        completion = client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            temperature=0.7,
        )

        raw_json_response = completion.choices[0].message.content
        
        # 5. Parse the AI's JSON string response into a Python object (Dict)
        story_data = json.loads(raw_json_response)
        
        # 6. Return the structured data (matches UserResponse model)
        return {"story_data": story_data}

    except Exception as e:
        # Catch any error (API failure, JSON parsing failure) and return a 500 error
        raise HTTPException(status_code=500, detail=f"Story Generation Error: {str(e)}")

# --- /getmagic is deleted as it was fundamentally flawed ---