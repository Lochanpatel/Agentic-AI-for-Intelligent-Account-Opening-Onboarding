"""
KYC Agent
---------
Simulates Onfido identity verification:
  - Verifies identity fields against the OCR-extracted document data
  - Returns confidence score, verification status, and any flags
In production: calls Onfido / Jumio SDK.
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

                # Base confidence
                confidence = round(random.uniform(0.82, 0.97), 3)

                # Degrade confidence for issues
                if "name_mismatch" in issues:
                    confidence -= 0.18
                if "document_expired" in issues:
                    confidence -= 0.30

                confidence = max(0.0, round(confidence, 3))
                verified = confidence >= 0.75

                flags = []
                if "name_mismatch" in issues:
                    flags.append("name_discrepancy")
                if confidence < 0.75:
                    flags.append("low_confidence_identity")

                return self._make_result(
                    AgentStatus.COMPLETED,
                    result={
                        "kyc_verified": verified,
                        "confidence_score": confidence,
                        "identity_flags": flags,
                        "provider": config.get("provider", "simulated"),
                        "check_id": f"KYC-{random.randint(100000,999999)}",
                        "document_number_verified": extracted.get("document_number"),
                    },
                    started_at=started_at,
                )
            else:
                raise NotImplementedError("Real Onfido integration not configured. Set SIMULATE_KYC=true.")

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)
