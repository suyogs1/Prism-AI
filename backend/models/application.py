"""
Application database models using SQLModel.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, JSON, Column


class Application(SQLModel, table=True):
    """
    MSME Application record.
    """
    id: str = Field(primary_key=True)
    business_name: str = Field(index=True)
    owner_name: str
    sector: str
    location: str
    loan_amount: float
    status: str = Field(default="PENDING_REVIEW")
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    
    # JSON column for dynamic attributes or uploaded doc references
    metadata_json: Optional[dict] = Field(default=None, sa_column=Column(JSON))
