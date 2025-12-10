# db/models.py
from pydantic import BaseModel
from typing import Dict, Any, Optional
import json

class UserRequest(BaseModel):
    theme: str
    mainCharacters: str
    episodes: str  # "2", "3", or "4"
    wordsPerEpisode: str
    choicesPerEpisode: str
    tone: str
    setting: str
    audience: str
    emojis: str
    specialRequests: str
    additionalInstructions: Optional[str] = None

class UserResponse(BaseModel):
    story: Dict[str, Any]
    error: Optional[str] = None
    
    @staticmethod
    def _count_episodes(story_data: Dict[str, Any], depth: int = 1, max_depth: int = 1) -> int:
        """Count the maximum depth/nesting of episodes"""
        if not story_data:
            return 0
        
        # Look for episode keys
        episode_keys = [k for k in story_data.keys() if k.startswith('episode_')]
        current_depth = depth
        
        for key in episode_keys:
            episode = story_data[key]
            # Check if this episode has choices with more episodes
            if episode.get('choices'):
                for choice_value in episode['choices'].values():
                    # Recursively check nested episodes
                    nested_depth = UserResponse._count_episodes(choice_value, depth + 1, max_depth)
                    if nested_depth > max_depth:
                        max_depth = nested_depth
        
        return max(max_depth, current_depth)