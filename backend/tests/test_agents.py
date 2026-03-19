"""
pytest — Agent Unit Tests
Tests each agent's execute() with mock session state (no real DB or API calls).
"""
import asyncio
import pytest
from datetime import datetime, timedelta
from models.session import (
    OnboardingSession, ApplicantInfo, AgentResult, AgentStatus
)
from agents.doc_ingestion import DocIngestionAgent
from agents.kyc import KYCAgent
from agents.risk_scoring import RiskScoringAgent
from agents.aml import AMLAgent
from agents.decision import DecisionAgent
from agents.notification import NotificationAgent


def make_session(with_doc=True, with_doc_result=True) -> OnboardingSession:
    session = OnboardingSession(
        institution_id="default",
        applicant=ApplicantInfo(
            first_name="Alice",
            last_name="Smith",
            email="alice@example.com",
            phone="+1234567890",
            date_of_birth="1990-06-15",
            nationality="US",
            address="123 Main St, New York, NY",
        ),
        document_path="/tmp/test_doc.png" if with_doc else None,
        document_type="PASSPORT",
    )
    if with_doc_result:
        session.agent_results["doc_ingestion"] = AgentResult(
            agent_id="doc_ingestion",
            status=AgentStatus.COMPLETED,
            result={
                "extracted_fields": {
                    "full_name": "Alice Smith",
                    "date_of_birth": "1990-06-15",
                    "document_number": "P1234567",
                    "document_type": "PASSPORT",
                    "expiry_date": (datetime.utcnow() + timedelta(days=730)).strftime("%Y-%m-%d"),
                    "ocr_confidence": 0.96,
                },
                "validation_issues": [],
                "doc_valid": True,
            },
            completed_at=datetime.utcnow(),
        )
    return session


# ──────────────────────────────────────────────
# DocIngestion Agent
# ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_doc_ingestion_no_document():
    agent = DocIngestionAgent()
    session = make_session(with_doc=False, with_doc_result=False)
    result = await agent.execute(session, {})
    assert result.status == AgentStatus.FAILED
    assert "No document" in result.error


@pytest.mark.asyncio
async def test_doc_ingestion_simulated():
    agent = DocIngestionAgent()
    session = make_session(with_doc=True, with_doc_result=False)
    result = await agent.execute(session, {})
    assert result.status == AgentStatus.COMPLETED
    assert "extracted_fields" in result.result
    assert result.result["extracted_fields"]["full_name"] == "Alice Smith"


# ──────────────────────────────────────────────
# KYC Agent
# ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_kyc_no_doc_result():
    agent = KYCAgent()
    session = make_session(with_doc_result=False)
    result = await agent.execute(session, {})
    assert result.status == AgentStatus.FAILED


@pytest.mark.asyncio
async def test_kyc_simulated_pass():
    agent = KYCAgent()
    session = make_session(with_doc_result=True)
    result = await agent.execute(session, {"provider": "simulated"})
    assert result.status == AgentStatus.COMPLETED
    assert "kyc_verified" in result.result
    assert "confidence_score" in result.result


# ──────────────────────────────────────────────
# Risk Scoring Agent
# ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_risk_scoring_clean():
    agent = RiskScoringAgent()
    session = make_session()
    # Add KYC result
    session.agent_results["kyc_check"] = AgentResult(
        agent_id="kyc_check",
        status=AgentStatus.COMPLETED,
        result={"kyc_verified": True, "confidence_score": 0.95, "identity_flags": []},
        completed_at=datetime.utcnow(),
    )
    result = await agent.execute(session, {"threshold": 0.70})
    assert result.status == AgentStatus.COMPLETED
    assert 0.0 <= result.result["risk_score"] <= 1.0
    assert "reasoning" in result.result


@pytest.mark.asyncio
async def test_risk_scoring_with_issues():
    agent = RiskScoringAgent()
    session = make_session()
    session.agent_results["doc_ingestion"].result["validation_issues"] = ["name_mismatch", "doc_near_expiry"]
    session.agent_results["kyc_check"] = AgentResult(
        agent_id="kyc_check",
        status=AgentStatus.COMPLETED,
        result={"kyc_verified": False, "confidence_score": 0.61, "identity_flags": ["low_confidence_identity"]},
        completed_at=datetime.utcnow(),
    )
    result = await agent.execute(session, {"threshold": 0.70})
    assert result.status == AgentStatus.COMPLETED
    assert result.result["risk_score"] > 0.20
    assert len(result.result["triggered_rules"]) > 0


# ──────────────────────────────────────────────
# AML Agent
# ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_aml_disabled():
    agent = AMLAgent()
    session = make_session()
    result = await agent.execute(session, {"enabled": False})
    assert result.status == AgentStatus.SKIPPED


@pytest.mark.asyncio
async def test_aml_clean_applicant():
    agent = AMLAgent()
    session = make_session()
    result = await agent.execute(session, {"enabled": True})
    assert result.status == AgentStatus.COMPLETED
    assert result.result["aml_clear"] is True
    assert result.result["sanctions_match"] is False


# ──────────────────────────────────────────────
# Decision Agent
# ──────────────────────────────────────────────

def _add_risk_result(session, risk_score, rules=[]):
    session.agent_results["risk_scoring"] = AgentResult(
        agent_id="risk_scoring",
        status=AgentStatus.COMPLETED,
        result={"risk_score": risk_score, "triggered_rules": rules, "reasoning": "Test"},
        completed_at=datetime.utcnow(),
    )


def _add_kyc_result(session, verified=True):
    session.agent_results["kyc_check"] = AgentResult(
        agent_id="kyc_check",
        status=AgentStatus.COMPLETED,
        result={"kyc_verified": verified, "confidence_score": 0.95, "identity_flags": []},
        completed_at=datetime.utcnow(),
    )


def _add_aml_result(session, clear=True):
    session.agent_results["aml_screen"] = AgentResult(
        agent_id="aml_screen",
        status=AgentStatus.COMPLETED,
        result={"aml_clear": clear, "sanctions_match": not clear, "pep_match": False},
        completed_at=datetime.utcnow(),
    )


@pytest.mark.asyncio
async def test_decision_approved():
    agent = DecisionAgent()
    session = make_session()
    _add_risk_result(session, 0.10)
    _add_kyc_result(session, True)
    _add_aml_result(session, True)
    result = await agent.execute(session, {"threshold": 0.70})
    assert result.status == AgentStatus.COMPLETED
    assert result.result["decision"] == "APPROVED"


@pytest.mark.asyncio
async def test_decision_rejected_aml():
    agent = DecisionAgent()
    session = make_session()
    _add_risk_result(session, 0.50)
    _add_kyc_result(session, True)
    _add_aml_result(session, False)
    result = await agent.execute(session, {"threshold": 0.70})
    assert result.result["decision"] == "REJECTED"


@pytest.mark.asyncio
async def test_decision_manual_review_high_risk():
    agent = DecisionAgent()
    session = make_session()
    _add_risk_result(session, 0.85, ["name_mismatch", "doc_near_expiry"])
    _add_kyc_result(session, True)
    _add_aml_result(session, True)
    result = await agent.execute(session, {"threshold": 0.70})
    assert result.result["decision"] == "MANUAL_REVIEW"


# ──────────────────────────────────────────────
# Notification Agent
# ──────────────────────────────────────────────

@pytest.mark.asyncio
async def test_notification_approved():
    agent = NotificationAgent()
    session = make_session()
    session.agent_results["decision"] = AgentResult(
        agent_id="decision",
        status=AgentStatus.COMPLETED,
        result={"decision": "APPROVED"},
        completed_at=datetime.utcnow(),
    )
    result = await agent.execute(session, {})
    assert result.status == AgentStatus.COMPLETED
    assert result.result["sent"] is True
    assert result.result["decision"] == "APPROVED"
