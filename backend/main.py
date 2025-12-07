from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware  

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router for API endpoints
main_router = APIRouter()

@main_router.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}

app.include_router(main_router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)