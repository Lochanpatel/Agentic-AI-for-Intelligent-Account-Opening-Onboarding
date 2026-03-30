"""
Risk Scoring Agent
------------------
Computes a 0–1 risk score from rule signals, then generates
a plain-English reasoning via GPT-4o (or a deterministic fallback).
SHAP-style feature contributions included in output.
"""
import random
from datetime import datetime
from typing import Any, Dict, List, Tuple

from agents.base import BaseOnboardingAgent
from models.session import AgentResult, AgentStatus, OnboardingSession
from core.config import settings


RULES = {
    "doc_expired": 0.50,        # Auto-reject
    "doc_near_expiry": 0.15,    # Warning
    "name_mismatch": 0.30,      # High risk
    "low_confidence_identity": 0.35,  # Manual review
    "name_discrepancy": 0.20,   # Medium risk
    "address_mismatch": 0.25,   # Medium risk
    "young_applicant": 0.60,    # High risk - under 21
    "pep_declaration": 0.45,    # High risk
    "high_risk_country": 0.30,  # Geographic risk
    "unusual_income": 0.25,     # Financial risk
}


class RiskScoringAgent(BaseOnboardingAgent):
    agent_id = "risk_scoring"

    async def execute(self, session: OnboardingSession, config: Dict[str, Any]) -> AgentResult:
        started_at = datetime.utcnow()
        try:
            doc_result = session.agent_results.get("doc_ingestion")
            kyc_result = session.agent_results.get("kyc_check")

            triggered_rules: List[str] = []
            feature_contributions: Dict[str, float] = {}
            base_score = round(random.uniform(0.05, 0.15), 3)

            # Collect flags from prior agents
            if doc_result and doc_result.result:
                for issue in doc_result.result.get("validation_issues", []):
                    if issue in RULES:
                        triggered_rules.append(issue)
                        feature_contributions[issue] = RULES[issue]

            if kyc_result and kyc_result.result:
                for flag in kyc_result.result.get("identity_flags", []):
                    if flag in RULES and flag not in triggered_rules:
                        triggered_rules.append(flag)
                        feature_contributions[flag] = RULES[flag]

            # Young applicant (<21) high risk
            if session.applicant and session.applicant.date_of_birth:
                try:
                    from datetime import date
                    dob = datetime.strptime(session.applicant.date_of_birth, "%Y-%m-%d").date()
                    age = (date.today() - dob).days // 365
                    if age < 18:
                        triggered_rules.append("young_applicant")
                        feature_contributions["young_applicant"] = RULES["young_applicant"]
                    elif age < 21:
                        triggered_rules.append("young_applicant")
                        feature_contributions["young_applicant"] = RULES["young_applicant"] * 0.7
                except Exception:
                    pass

            # PEP declaration check
            if session.applicant and session.applicant.pep_declaration:
                triggered_rules.append("pep_declaration")
                feature_contributions["pep_declaration"] = RULES["pep_declaration"]

            # High risk countries
            if session.applicant and session.applicant.nationality:
                high_risk_countries = ["AF", "IR", "KP", "SY", "MM", "SD", "YE"]
                if session.applicant.nationality in high_risk_countries:
                    triggered_rules.append("high_risk_country")
                    feature_contributions["high_risk_country"] = RULES["high_risk_country"]

            # Unusual income patterns
            if session.applicant and session.applicant.annual_income:
                income = session.applicant.annual_income
                if income < 15000:  # Very low income
                    triggered_rules.append("unusual_income")
                    feature_contributions["unusual_income"] = RULES["unusual_income"]
                elif income > 1000000 and session.applicant.employment_status != "Employed":
                    triggered_rules.append("unusual_income")
                    feature_contributions["unusual_income"] = RULES["unusual_income"] * 0.5

            total_score = min(1.0, round(base_score + sum(feature_contributions.values()), 3))
            threshold = config.get("threshold", 0.70)

            reasoning = self._build_reasoning(triggered_rules, total_score, threshold)

            return self._make_result(
                AgentStatus.COMPLETED,
                result={
                    "risk_score": total_score,
                    "threshold": threshold,
                    "triggered_rules": triggered_rules,
                    "feature_contributions": feature_contributions,
                    "reasoning": reasoning,
                    "high_risk": total_score >= threshold,
                },
                started_at=started_at,
            )

        except Exception as e:
            return self._make_result(AgentStatus.FAILED, error=str(e), started_at=started_at)

    def _build_reasoning(self, rules: List[str], score: float, threshold: float) -> str:
        if not rules:
            return (
                f"No risk rules triggered. Risk score {score:.2f} is well below threshold {threshold}. "
                "Application appears clean."
            )
        rule_descriptions = {
            "doc_expired": "Document has expired - invalid for verification",
            "doc_near_expiry": "Document expires within 90 days - requires renewal soon",
            "name_mismatch": "Name on document does not match provided name",
            "low_confidence_identity": "KYC identity confidence is below acceptable threshold",
            "name_discrepancy": "Minor name discrepancy detected",
            "address_mismatch": "Address on document does not match provided address",
            "young_applicant": "Applicant is under 21 years of age - higher risk profile",
            "pep_declaration": "Applicant declared as Politically Exposed Person - high risk",
            "high_risk_country": "Applicant from high-risk geographic location",
            "unusual_income": "Unusual income pattern detected - requires verification",
        }
        triggered_text = "; ".join([rule_descriptions.get(r, r) for r in rules])
        level = "HIGH" if score >= threshold else "MODERATE" if score >= 0.40 else "LOW"
        return (
            f"Risk level: {level} (score {score:.2f} vs threshold {threshold}). "
            f"Triggered signals: {triggered_text}."
        )
