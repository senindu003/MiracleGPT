# backend/db/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# 1. Prefer DATABASE_URL from environment (Railway / cloud)
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. If not set, fall back to local development DB (MySQL)
if not DATABASE_URL:
    # Local defaults – adjust if your local DB is different
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_NAME = os.getenv("DB_NAME", "interactive_story_db")
    DB_PORT = os.getenv("DB_PORT", "3306")

    # Local MySQL using PyMySQL driver
    DATABASE_URL = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

# 3. Normalize Railway Postgres URL to an explicit SQLAlchemy dialect
#    Many Railway URLs are like: postgresql://user:pass@host:port/db
#    SQLAlchemy works better if we make it: postgresql+psycopg2://...
if DATABASE_URL.startswith("postgres://"):
    # Old-style prefix -> upgrade to postgresql+psycopg2
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL.startswith("postgresql://") and "+psycopg2" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://", "postgresql+psycopg2://", 1
    )

# 4. Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=True)  # echo=True logs SQL to stdout
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# 5. Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
