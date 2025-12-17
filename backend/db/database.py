# backend/db/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# 1. Try DATABASE_URL first (for cloud: Railway, Render, etc.)
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. If not set, fall back to local development DB (MySQL or Postgres)
if not DATABASE_URL:
    # Change these defaults to match your local DB if needed
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_NAME = os.getenv("DB_NAME", "interactive_story_db")
    DB_PORT = os.getenv("DB_PORT", "3306")

    # For local MySQL (using PyMySQL driver)
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
