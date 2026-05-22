from fastapi import FastAPI
from config import settings
from es_client import create_index
from api.jobs import router as jobs_router

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(jobs_router)

@app.on_event("startup")
async def startup_event():
    # Initialize Elasticsearch index on application startup
    create_index()

@app.get("/")
async def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "supported_languages": settings.SUPPORTED_LANGUAGES
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}
