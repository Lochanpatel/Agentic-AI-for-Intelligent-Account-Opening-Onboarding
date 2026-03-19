"""
AML / Compliance Agent
-----------------------
Checks applicant against sanctions lists (OFAC, EU, UN) and PEP databases.
Simulates ComplyAdvantage API. Also performs RAG-based policy lookup stub.
"""
import random
from datetime import datetime
from typing import Any, Dict

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession
from core.config import settings

# Mock sanctions data for simulation
_MOCK_SANCTIONS = [
    "John Terrorist",
    "Jane Fraudster",
    "Bob Launderer",
]

_MOCK_PEP = [
    "Alice Senator",
    "Carlos Minister",
]


class AMLAgent(BaseOnboardingAgent):
    agent_id = "aml_screen"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            if not config.get("enabled", True):
                return self._make_result(
                    AgentStatus.SKIPPED,
                    result={"reason": "AML screening disabled in workflow config"},
                    started_at=started_at,
                )

            if settings.simulate_aml:
                full_name = ""
                if session.applicant:
                    full_name = f"{session.applicant.first_name} {session.applicant.last_name}"

                # Check sanctions (mock)
                sanctions_match = any(
                    name.lower() in full_name.lower() or full_name.lower() in name.lower()
                    for name in _MOCK_SANCTIONS
                )
                # Check PEP (mock)
                pep_match = any(
                    name.lower() in full_name.lower() or full_name.lower() in name.lower()
                    for name in _MOCK_PEP
                )
                pep_confidence = round(random.uniform(0.1, 0.45), 3) if pep_match else 0.0

                aml_clear = not sanctions_match and (
                    not pep_match or pep_confidence < config.get("pep_threshold", 0.6)
                )

                matches = []
                if sanctions_match:
                    matches.append({"list": "OFAC", "match_type": "exact", "confidence": 0.92})
                if pep_match:
                    matches.append({"list": "PEP", "match_type": "fuzzy", "confidence": pep_confidence})

                return self._make_result(
                    AgentStatus.COMPLETED,
                    result={
                        "aml_clear": aml_clear,
                        "sanctions_match": sanctions_match,
                        "pep_match": pep_match,
                        "pep_confidence": pep_confidence,
                        "matches": matches,
                        "lists_checked": ["OFAC", "EU_SANCTIONS", "UN_SANCTIONS", "PEP_GLOBAL"],
                        "provider": "simulated",
                    },
                    started_at=started_at,
                )
            else:
                raise NotImplementedError("Real ComplyAdvantage integration not configured. Set SIMULATE_AML=true.")

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)
