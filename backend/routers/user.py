from fastapi import APIRouter, Depends, HTTPException
from db.database import get_db
from sqlalchemy.orm import Session
from routers.models import addUser, checkUser, addStory
from db.models import User, Story
from passlib.hash import bcrypt
from sqlalchemy import or_, func

def hash_password(password):
  return bcrypt.hash(password)

def verify_password(plain_password, hashed_password):
  return bcrypt.verify(plain_password, hashed_password)

user_router = APIRouter()

@user_router.post("/signup")
async def signup(user: addUser, db: Session = Depends(get_db)) -> dict:
  existing_user = db.query(User).filter(or_(User.email == user.email, User.username == user.username)).first()
  if existing_user:
    raise HTTPException(status_code=400, detail="User already exists")
  new_user = User(firstname=user.firstname, lastname=user.lastname, username=user.username, email=user.email, password=hash_password(user.password))
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  return {"message": "User created successfully", "current_user": f"{new_user.username}"}


@user_router.post("/login")
async def login(user: checkUser, db: Session = Depends(get_db)) -> dict:
  existing_user = db.query(User).filter(or_(User.email == user.email, User.username == user.email)).first()
  if not existing_user:
    raise HTTPException(status_code=400, detail="User not found")
  if not verify_password(user.password, existing_user.password):
    raise HTTPException(status_code=400, detail="Invalid password")
  return {"message": "Login successful", "current_user": f"{existing_user.username}"}


@user_router.post("/save")
def post_story(story: addStory, db: Session = Depends(get_db)) -> dict:
  new_story = Story(author=story.author, title=story.title, story=story.story, created_at=func.now())
  db.add(new_story)
  db.commit()
  db.refresh(new_story)
  return {"message": "Story saved successfully", "story_id": new_story.story_id}
  
  