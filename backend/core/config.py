"""Core configuration — reads from .env file."""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    gemini_api_key: str = ""
    database_url: str = "sqlite:///./prism.db"
    secret_key: str = "dev-secret-key"
    environment: str = "development"
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
