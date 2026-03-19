"""Audit API — immutable audit trail per session"""
from fastapi import APIRouter, HTTPException
from core.database import get_db

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/{session_id}")
async def get_audit_trail(session_id: str):
    """Return full immutable audit trail for a session."""
    db = get_db()
    # Verify session exists
    raw = await db["sessions"].find_one({"_id": session_id})
    if not raw:
        raise HTTPException(status_code=404, detail="Session not found")

    cursor = db["audit_logs"].find(
        {"session_id": session_id}
    ).sort("timestamp", 1)

    entries = []
    async for doc in cursor:
        doc["entry_id"] = str(doc.pop("_id"))
        doc["timestamp"] = doc["timestamp"].isoformat() if doc.get("timestamp") else None
        entries.append(doc)

    return {"session_id": session_id, "total": len(entries), "entries": entries}
