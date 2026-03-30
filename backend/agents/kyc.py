"""
KYC Agent
---------
Simulates Onfido identity verification:
  - Verifies identity fields against the OCR-extracted document data
  - Returns confidence score, verification status, and any flags
"""
import random
from datetime import datetime
from typing import Any, Dict

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession
from core.config import settings


class KYCAgent(BaseOnboardingAgent):
    agent_id = "kyc_check"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            doc_result = session.agent_results.get("doc_ingestion")
            if not doc_result or doc_result.status != AgentStatus.COMPLETED:
                return self._make_result(
                    AgentStatus.FAILED,
                    error="DocIngestion must complete before KYC",
                    started_at=started_at,
                )

            if settings.simulate_kyc:
                extracted = doc_result.result.get("extracted_fields", {})
                issues = doc_result.result.get("validation_issues", [])

                # Start with high confidence, reduce based on actual issues
                confidence = 0.95

                # Apply penalties for real issues
                if "name_mismatch" in issues:
                    confidence -= 0.25
                if "document_expired" in issues:
                    confidence -= 0.40
                if "doc_near_expiry" in issues:
                    confidence -= 0.15
                if "address_mismatch" in issues:
                    confidence -= 0.20

                # Additional checks
                if session.applicant:
                    # Check age
                    if session.applicant.date_of_birth:
                        try:
                            from datetime import date
                            dob = datetime.strptime(session.applicant.date_of_birth, "%Y-%m-%d").date()
                            age = (date.today() - dob).days // 365
                            if age < 18:
                                confidence -= 0.50  # Minor - high risk
                            elif age < 21:
                                confidence -= 0.20  # Young adult
                        except Exception:
                            confidence -= 0.10

                    # Check for incomplete data
                    if not session.applicant.tax_id or len(session.applicant.tax_id) < 9:
                        confidence -= 0.15

                    # Check phone number format
                    if session.applicant.phone and len(session.applicant.phone) < 10:
                        confidence -= 0.10

                confidence = max(0.0, round(confidence, 3))
                verified = confidence >= 0.80  # Higher threshold for production

                flags = []
                if "name_mismatch" in issues:
                    flags.append("name_discrepancy")
                if confidence < 0.80:
                    flags.append("low_confidence_identity")
                if confidence < 0.60:
                    flags.append("identity_verification_failed")

                return self._make_result(
                    AgentStatus.COMPLETED,
                    result={
                        "kyc_verified": verified,
                        "confidence_score": confidence,
                        "identity_flags": flags,
                        "provider": config.get("provider", "simulated"),
                        "check_id": f"KYC-{random.randint(100000,999999)}",
                        "document_number_verified": extracted.get("document_number"),
                        "verification_method": "document_biometric",
                    },
                    started_at=started_at,
                )
            else:
                raise NotImplementedError("Real Onfido integration not configured. Set SIMULATE_KYC=true.")

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)
