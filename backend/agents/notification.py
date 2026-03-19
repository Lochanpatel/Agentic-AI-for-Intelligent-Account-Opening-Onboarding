"""
Notification Agent
------------------
Sends confirmation email/SMS to applicant after decision.
Simulates SendGrid (logs event to audit trail).
In production: calls SendGrid API with templates.
"""
from datetime import datetime
from typing import Any, Dict

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession


DECISION_MESSAGES = {
    "APPROVED": (
        "Congratulations! Your account opening application has been approved. "
        "You will receive your account details within 24 hours."
    ),
    "REJECTED": (
        "We regret to inform you that your account opening application has not been approved at this time. "
        "Please contact our support team for more information."
    ),
    "MANUAL_REVIEW": (
        "Your application is currently under review by our compliance team. "
        "We will contact you within 2 business days with a decision."
    ),
}


class NotificationAgent(BaseOnboardingAgent):
    agent_id = "notification"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            decision_result = session.agent_results.get("decision")
            decision = "MANUAL_REVIEW"
            if decision_result and decision_result.result:
                decision = decision_result.result.get("decision", "MANUAL_REVIEW")

            recipient_email = session.applicant.email if session.applicant else "unknown@example.com"
            recipient_name = (
                f"{session.applicant.first_name} {session.applicant.last_name}"
                if session.applicant else "Applicant"
            )
            message_body = DECISION_MESSAGES.get(decision, DECISION_MESSAGES["MANUAL_REVIEW"])

            notification = {
                "channel": "email",
                "recipient": recipient_email,
                "recipient_name": recipient_name,
                "subject": f"Account Opening Application — {decision.replace('_', ' ').title()}",
                "body": message_body,
                "decision": decision,
                "provider": "simulated_sendgrid",
                "sent": True,
            }

            print(f"[NOTIFICATION] → {recipient_email}: {notification['subject']}")

            return self._make_result(
                AgentStatus.COMPLETED,
                result=notification,
                started_at=started_at,
            )

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)
