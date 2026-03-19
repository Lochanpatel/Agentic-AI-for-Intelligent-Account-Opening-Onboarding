"""
DocIngestion Agent
------------------
Simulates AWS Textract OCR:
  - Reads the uploaded file metadata
  - Extracts structured fields: name, DOB, doc_number, expiry, doc_type
  - Validates field completeness and expiry
In production: calls boto3 Textract API.
"""
import os
import random
from datetime import datetime, timedelta
from typing import Any, Dict

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession
from core.config import settings


class DocIngestionAgent(BaseOnboardingAgent):
    agent_id = "doc_ingestion"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            if not session.document_path:
                return self._make_result(
                    AgentStatus.FAILED,
                    error="No document uploaded",
                    started_at=started_at,
                )

            doc_exists = os.path.exists(session.document_path)

            if settings.simulate_ocr:
                # Simulated extraction — realistic demo data
                expiry_date = (datetime.utcnow() + timedelta(days=random.randint(30, 1825))).strftime("%Y-%m-%d")
                extracted = {
                    "full_name": f"{session.applicant.first_name} {session.applicant.last_name}" if session.applicant else "John Doe",
                    "date_of_birth": session.applicant.date_of_birth if session.applicant else "1990-01-01",
                    "document_number": f"P{random.randint(1000000, 9999999)}",
                    "document_type": session.document_type or "PASSPORT",
                    "expiry_date": expiry_date,
                    "issuing_country": session.applicant.nationality if session.applicant else "US",
                    "address_on_doc": session.applicant.address if session.applicant else "123 Main St",
                    "ocr_confidence": round(random.uniform(0.88, 0.99), 3),
                    "file_present": doc_exists,
                }
            else:
                # Production: call AWS Textract
                raise NotImplementedError("Real Textract integration not configured. Set SIMULATE_OCR=true.")

            # Validate fields
            issues = []
            expiry = datetime.strptime(extracted["expiry_date"], "%Y-%m-%d")
            if expiry < datetime.utcnow():
                issues.append("document_expired")
            elif expiry < datetime.utcnow() + timedelta(days=90):
                issues.append("doc_near_expiry")

            if session.applicant:
                provided_name = f"{session.applicant.first_name} {session.applicant.last_name}".lower()
                doc_name = extracted["full_name"].lower()
                if provided_name not in doc_name and doc_name not in provided_name:
                    issues.append("name_mismatch")

            return self._make_result(
                AgentStatus.COMPLETED,
                result={
                    "extracted_fields": extracted,
                    "validation_issues": issues,
                    "doc_valid": len([i for i in issues if "expired" in i]) == 0,
                },
                started_at=started_at,
            )

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)
