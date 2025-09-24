from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.posts import router as posts_router
from app.api.users import router as users_router

app = FastAPI(
    title="Modern Blogging Platform API",
    description="A full-stack blogging platform with FastAPI backend",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(posts_router, prefix="/api/posts", tags=["posts"])
app.include_router(users_router, prefix="/api/users", tags=["users"])


@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Modern Blogging Platform API",
        "docs": "/docs",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
