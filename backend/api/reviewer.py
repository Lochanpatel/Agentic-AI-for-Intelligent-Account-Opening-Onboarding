"""Reviewer API — human-in-the-loop decision override"""
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from core.database import get_db
from models.session import OnboardingSession, SessionStatus
from models.audit import write_audit
from api.auth import get_current_admin

router = APIRouter(prefix="/review", tags=["Reviewer"])


class ReviewDecisionRequest(BaseModel):
    decision: str  # APPROVED or REJECTED
    reviewer_id: str
    note: Optional[str] = None


@router.get("/queue")
async def get_review_queue(limit: int = 50, admin: str = Depends(get_current_admin)):
    """Get all sessions pending human review."""
    db = get_db()
    cursor = db["sessions"].find({"status": "MANUAL_REVIEW"}).sort("created_at", 1).limit(limit)
    sessions = []
    async for doc in cursor:
        s = OnboardingSession.from_mongo(doc)
        decision_result = s.agent_results.get("decision")
        risk_result = s.agent_results.get("risk_scoring")
        sessions.append({
            "session_id": s.session_id,
            "institution_id": s.institution_id,
            "applicant_name": f"{s.applicant.first_name} {s.applicant.last_name}" if s.applicant else None,
            "applicant_email": s.applicant.email if s.applicant else None,
            "risk_score": s.risk_score,
            "triggered_rules": s.triggered_rules,
            "decision_reasoning": s.decision_reasoning,
            "created_at": s.created_at,
            "agent_results": {
                k: v.model_dump() for k, v in s.agent_results.items()
            },
        })
    total = await db["sessions"].count_documents({"status": "MANUAL_REVIEW"})
    return {"queue": sessions, "total": total}


@router.post("/{session_id}/decision")
async def submit_review_decision(session_id: str, body: ReviewDecisionRequest, admin: str = Depends(get_current_admin)):
    """Human reviewer approves or rejects a MANUAL_REVIEW session."""
    db = get_db()
    raw = await db["sessions"].find_one({"_id": session_id})
    if not raw:
        raise HTTPException(status_code=404, detail="Session not found")

    session = OnboardingSession.from_mongo(raw)
    if session.status != SessionStatus.MANUAL_REVIEW:
        raise HTTPException(
            status_code=400,
            detail=f"Session is not in MANUAL_REVIEW state (current: {session.status})"
        )

    if body.decision not in ("APPROVED", "REJECTED"):
        raise HTTPException(status_code=400, detail="Decision must be APPROVED or REJECTED")

    new_status = SessionStatus.APPROVED if body.decision == "APPROVED" else SessionStatus.REJECTED
    await db["sessions"].update_one(
        {"_id": session_id},
        {
            "$set": {
                "status": new_status,
                "final_decision": body.decision,
                "reviewer_id": body.reviewer_id,
                "reviewer_note": body.note,
                "updated_at": datetime.utcnow(),
            }
        }
    )

    await write_audit(
        db, session_id, "human_review_decision",
        actor=body.reviewer_id,
        input_data={"decision": body.decision},
        reasoning=body.note,
    )

    return {
        "session_id": session_id,
        "decision": body.decision,
        "reviewer_id": body.reviewer_id,
        "updated_at": datetime.utcnow().isoformat(),
    }
