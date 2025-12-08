from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routers.user import user_router
from routers.ai import ai_router


load_dotenv()

origins = os.getenv("ORIGINS").split(",")


app = FastAPI()

main_router = APIRouter()
# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router for API endpoints


@main_router.get("/")
def hello():
    return {"message": "Welcome!"}



app.include_router(main_router)
app.include_router(user_router)
app.include_router(ai_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080, reload=True)