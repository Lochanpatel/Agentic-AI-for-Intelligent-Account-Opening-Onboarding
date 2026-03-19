"""Upload API — document upload + pipeline trigger"""
import os
import asyncio
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
import aiofiles

from core.database import get_db
from core.config import settings
from models.session import OnboardingSession
from models.audit import write_audit
from orchestrator.engine import run_onboarding_pipeline

router = APIRouter(prefix="/sessions", tags=["Upload"])

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/webp",
    "application/pdf", "image/tiff",
}


async def _run_pipeline_bg(session_id: str):
    """Background task to run the agent pipeline."""
    try:
        db = get_db()
        await run_onboarding_pipeline(session_id, db)
    except Exception as e:
        print(f"[PIPELINE ERROR] session={session_id}: {e}")
        db = get_db()
        await db["sessions"].update_one(
            {"_id": session_id},
            {"$set": {"status": "FAILED", "updated_at": datetime.utcnow()}}
        )


@router.post("/{session_id}/upload")
async def upload_document(
    session_id: str,
    background_tasks: BackgroundTasks,
    document_type: str = Form("PASSPORT"),
    file: UploadFile = File(...),
):
    """
    Accept document upload, save to disk, trigger agent pipeline in background.
    Returns immediately with 202 Accepted — client should poll /sessions/{id} for status.
    """
    db = get_db()
    raw = await db["sessions"].find_one({"_id": session_id})
    if not raw:
        raise HTTPException(status_code=404, detail="Session not found")

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, PDF, TIFF"
        )

    # Validate file size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.max_upload_size_mb:
        raise HTTPException(
            status_code=413,
            detail=f"File too large: {size_mb:.1f}MB. Max: {settings.max_upload_size_mb}MB"
        )

    # Save file
    upload_dir = os.path.join(settings.upload_dir, session_id)
    os.makedirs(upload_dir, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "bin"
    filename = f"document_{uuid.uuid4().hex[:8]}.{ext}"
    file_path = os.path.join(upload_dir, filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(content)

    # Update session with document info
    await db["sessions"].update_one(
        {"_id": session_id},
        {
            "$set": {
                "document_path": file_path,
                "document_type": document_type.upper(),
                "updated_at": datetime.utcnow(),
            }
        }
    )

    await write_audit(
        db, session_id, "document_uploaded",
        actor="applicant",
        input_data={"filename": filename, "document_type": document_type, "size_mb": round(size_mb, 3)}
    )

    # Trigger pipeline asynchronously
    background_tasks.add_task(_run_pipeline_bg, session_id)

    return {
        "message": "Document uploaded. Processing started.",
        "session_id": session_id,
        "filename": filename,
        "status": "PROCESSING",
    }
