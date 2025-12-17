# backend/routers/ai.py
from fastapi import APIRouter, HTTPException, Depends, status
import os
from openai import OpenAI
from dotenv import load_dotenv
import json
import re
from datetime import date
from sqlalchemy.orm import Session

from backend.db.models import User, Usage
from backend.routers.models import (
    UserRequest,
    UserResponse,
    enhanceRequest,
    enhanceResponse,
)
from backend.routers.auth import get_current_user
from backend.db.database import get_db

# ... your helper functions (clean_json_string, extract_json, etc.) unchanged ...

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
async def generate_story(
    user_request: UserRequest,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
) -> UserResponse:
    # Explicitly block unauthenticated non-OPTIONS calls
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    usage = get_or_create_today_usage(db, current_user.username)

    if usage.generate_count >= GENERATE_LIMIT_PER_DAY:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                f"Daily limit of {GENERATE_LIMIT_PER_DAY} generations reached. "
                "Please come back tomorrow!"
            ),
        )

    # (your prompt construction and OpenAI call unchanged)
    # ...
    # return UserResponse(...)


@ai_router.post("/enhance")
async def enhance_story(
    passedStory: enhanceRequest,
    current_user: User | None = Depends(get_current_user),
) -> enhanceResponse:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # (rest of your enhance_story logic unchanged)
    # ...
