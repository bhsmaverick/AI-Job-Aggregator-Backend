import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Job Aggregator SaaS"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/jobaggregator")
    ELASTICSEARCH_URL: str = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")
            
    # Supported output/processing languages (Chinese is strictly excluded)
    SUPPORTED_LANGUAGES: list[str] = [
        "EN", "ES", "PT", "DE", "FR", "UA", "PL", "JA", "AR", "TR", "HI", "IT", "KO", "ID"
    ]

settings = Settings()
