from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class SessionStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    MANUAL_REVIEW = "MANUAL_REVIEW"
    FAILED = "FAILED"


class AgentStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"


class AgentResult(BaseModel):
    agent_id: str
    status: AgentStatus = AgentStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class ApplicantInfo(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    date_of_birth: str
    nationality: str
    address: str


class OnboardingSession(BaseModel):
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str = "default"
    status: SessionStatus = SessionStatus.PENDING
    applicant: Optional[ApplicantInfo] = None
    document_path: Optional[str] = None
    document_type: Optional[str] = None
    agent_results: Dict[str, AgentResult] = {}
    risk_score: Optional[float] = None
    final_decision: Optional[str] = None
    decision_reasoning: Optional[str] = None
    triggered_rules: List[str] = []
    reviewer_id: Optional[str] = None
    reviewer_note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> dict:
        data = self.model_dump()
        data["_id"] = data.pop("session_id")
        return data

    @classmethod
    def from_mongo(cls, data: dict) -> "OnboardingSession":
        if data and "_id" in data:
            data["session_id"] = str(data.pop("_id"))
        return cls(**data)
