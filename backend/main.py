from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from backend.routers.ai import ai_router
from backend.routers.user import user_router
from backend.db.database import engine, Base
from contextlib import asynccontextmanager

load_dotenv()

origins = os.getenv("ORIGINS").split(",")

@asynccontextmanager
async def lifespan(app):
    Base.metadata.create_all(bind=engine)
    yield
    print("FastAPI server is shutting down!")

app = FastAPI(lifespan=lifespan)

main_router = APIRouter()
# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@main_router.get("/")
def hello():
    return {"message": "Welcome!"}

app.include_router(main_router)
app.include_router(ai_router)
app.include_router(user_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)