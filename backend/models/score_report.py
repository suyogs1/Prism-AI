"""
Score report database model using SQLModel.
"""

from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field, JSON, Column


class ScoreReport(SQLModel, table=True):
    """
    Computed score report for a specific application.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    application_id: str = Field(index=True, unique=True)
    prism_score: int
    risk_tier: str
    confidence: str
    data_completeness: float
    sub_scores: dict = Field(default_factory=dict, sa_column=Column(JSON))
    weights: dict = Field(default_factory=dict, sa_column=Column(JSON))
    signals: dict = Field(default_factory=dict, sa_column=Column(JSON))
    recommended_loan: float
    missing_data: list = Field(default_factory=list, sa_column=Column(JSON))
    computed_at: datetime = Field(default_factory=datetime.utcnow)
