"""Sessions API — create, list, get session"""
import asyncio
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel

from core.database import get_db
from models.session import OnboardingSession, SessionStatus, ApplicantInfo

router = APIRouter(prefix="/sessions", tags=["Sessions"])


class CreateSessionRequest(BaseModel):
    institution_id: str = "default"
    applicant: ApplicantInfo


class CreateSessionResponse(BaseModel):
    session_id: str
    status: str
    created_at: datetime


@router.post("", response_model=CreateSessionResponse, status_code=201)
async def create_session(body: CreateSessionRequest):
    """Create a new onboarding session."""
    db = get_db()
    session = OnboardingSession(
        institution_id=body.institution_id,
        applicant=body.applicant,
    )
    await db["sessions"].insert_one(session.to_mongo())
    return CreateSessionResponse(
        session_id=session.session_id,
        status=session.status,
        created_at=session.created_at,
    )


@router.get("/{session_id}")
async def get_session(session_id: str):
    """Get full session details including agent results."""
    db = get_db()
    raw = await db["sessions"].find_one({"_id": session_id})
    if not raw:
        raise HTTPException(status_code=404, detail="Session not found")
    session = OnboardingSession.from_mongo(raw)
    return session.model_dump()


@router.get("")
async def list_sessions(
    status: Optional[str] = Query(None),
    institution_id: Optional[str] = Query(None),
    limit: int = Query(50, le=200),
    skip: int = Query(0),
):
    """List sessions with optional filters (admin/reviewer use)."""
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    if institution_id:
        query["institution_id"] = institution_id

    cursor = db["sessions"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    sessions = []
    async for doc in cursor:
        s = OnboardingSession.from_mongo(doc)
        sessions.append({
            "session_id": s.session_id,
            "institution_id": s.institution_id,
            "status": s.status,
            "risk_score": s.risk_score,
            "final_decision": s.final_decision,
            "applicant_name": f"{s.applicant.first_name} {s.applicant.last_name}" if s.applicant else None,
            "applicant_email": s.applicant.email if s.applicant else None,
            "created_at": s.created_at,
            "updated_at": s.updated_at,
        })

    total = await db["sessions"].count_documents(query)
    return {"sessions": sessions, "total": total, "skip": skip, "limit": limit}


@router.get("/stats/overview")
async def get_stats():
    """Dashboard statistics."""
    db = get_db()
    total = await db["sessions"].count_documents({})
    approved = await db["sessions"].count_documents({"status": "APPROVED"})
    rejected = await db["sessions"].count_documents({"status": "REJECTED"})
    review = await db["sessions"].count_documents({"status": "MANUAL_REVIEW"})
    processing = await db["sessions"].count_documents({"status": "PROCESSING"})
    pending = await db["sessions"].count_documents({"status": "PENDING"})
    return {
        "total": total,
        "approved": approved,
        "rejected": rejected,
        "manual_review": review,
        "processing": processing,
        "pending": pending,
        "approval_rate": round(approved / total * 100, 1) if total > 0 else 0,
    }
