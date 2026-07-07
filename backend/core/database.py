"""Database initialisation using SQLModel + SQLite."""

from sqlmodel import SQLModel, create_engine, Session
from core.config import settings
import models  # Register models with SQLModel metadata


engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},  # SQLite only
    echo=settings.environment == "development",
)


def create_db_and_tables():
    """Create all tables on startup. Called from main.py startup event."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """FastAPI dependency — yields a DB session per request."""
    with Session(engine) as session:
        yield session
