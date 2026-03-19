"""
Decision Agent
--------------
Synthesises all prior agent outputs into a final underwriting decision:
  APPROVED | REJECTED | MANUAL_REVIEW

Uses GPT-4o when OPENAI_API_KEY is set, otherwise applies deterministic logic.
Always produces a plain-English reasoning string.
"""
from datetime import datetime
from typing import Any, Dict

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession
from core.config import settings


class DecisionAgent(BaseOnboardingAgent):
    agent_id = "decision"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            # Gather signals
            risk_result = session.agent_results.get("risk_scoring")
            kyc_result = session.agent_results.get("kyc_check")
            aml_result = session.agent_results.get("aml_screen")
            doc_result = session.agent_results.get("doc_ingestion")

            risk_score = 0.0
            triggered_rules = []
            kyc_verified = True
            aml_clear = True

            if risk_result and risk_result.result:
                risk_score = risk_result.result.get("risk_score", 0.0)
                triggered_rules = risk_result.result.get("triggered_rules", [])

            if kyc_result and kyc_result.result:
                kyc_verified = kyc_result.result.get("kyc_verified", True)

            if aml_result and aml_result.result and aml_result.status != AgentStatus.SKIPPED:
                aml_clear = aml_result.result.get("aml_clear", True)

            threshold = config.get("threshold", 0.70)

            # Hard rejects
            if not aml_clear:
                decision = "REJECTED"
                reasoning = (
                    "Application REJECTED: Applicant matched against sanctions/AML watchlist. "
                    "Compliance team notified. No further review possible."
                )
            elif "document_expired" in triggered_rules:
                decision = "REJECTED"
                reasoning = (
                    "Application REJECTED: Submitted identity document has expired. "
                    "Applicant must reapply with a valid document."
                )
            elif not kyc_verified:
                decision = "MANUAL_REVIEW"
                reasoning = (
                    "Identity verification confidence is below acceptable threshold. "
                    "Routing to human reviewer for manual identity check."
                )
            elif risk_score >= threshold:
                decision = "MANUAL_REVIEW"
                rules_text = ", ".join(triggered_rules) if triggered_rules else "elevated risk signals"
                reasoning = (
                    f"Risk score {risk_score:.2f} exceeds threshold {threshold}. "
                    f"Triggered signals: {rules_text}. Escalating for human review."
                )
            else:
                decision = "APPROVED"
                reasoning = (
                    f"All checks passed. KYC verified. Risk score {risk_score:.2f} below threshold {threshold}. "
                    "AML screening clear. Account opening approved."
                )

            # Attempt LLM-enhanced reasoning if key configured
            if settings.openai_api_key and settings.openai_api_key.startswith("sk-"):
                try:
                    reasoning = await self._llm_reasoning(
                        session, decision, risk_score, triggered_rules, kyc_verified, aml_clear
                    )
                except Exception:
                    pass  # Fall back to deterministic reasoning above

            return self._make_result(
                AgentStatus.COMPLETED,
                result={
                    "decision": decision,
                    "risk_score": risk_score,
                    "reasoning": reasoning,
                    "triggered_rules": triggered_rules,
                    "kyc_verified": kyc_verified,
                    "aml_clear": aml_clear,
                },
                started_at=started_at,
            )

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)

    async def _llm_reasoning(
        self, session, decision, risk_score, triggered_rules, kyc_verified, aml_clear
    ) -> str:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.openai_api_key)
        prompt = f"""You are an AI underwriting compliance assistant at a bank.
An onboarding application has been evaluated. Write a concise, professional 2-3 sentence explanation for the decision.

Decision: {decision}
Risk Score: {risk_score:.2f}
KYC Verified: {kyc_verified}
AML Clear: {aml_clear}
Triggered Rules: {', '.join(triggered_rules) if triggered_rules else 'None'}
Applicant: {session.applicant.first_name + ' ' + session.applicant.last_name if session.applicant else 'Unknown'}

Write only the reasoning, no preamble."""

        response = await client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
