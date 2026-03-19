"""
Orchestration Engine
---------------------
LangGraph-style workflow runner.
  1. Loads workflow_config.yaml for the institution
  2. Resolves agent classes from the registry
  3. Runs agents sequentially, passing session state between steps
  4. Writes audit entries for each step
  5. Updates session status in MongoDB
"""
import asyncio
import os
from datetime import datetime
from typing import Dict, Any

import yaml

from agents.base import BaseOnboardingAgent
from agents.doc_ingestion import DocIngestionAgent
from agents.kyc import KYCAgent
from agents.risk_scoring import RiskScoringAgent
from agents.aml import AMLAgent
from agents.decision import DecisionAgent
from agents.notification import NotificationAgent
from models.session import OnboardingSession, SessionStatus, AgentStatus
from models.audit import write_audit
from core.config import settings

# Agent Registry — add new agents here, no other changes needed
AGENT_REGISTRY: Dict[str, BaseOnboardingAgent] = {
    "doc_ingestion": DocIngestionAgent(),
    "kyc_check": KYCAgent(),
    "risk_scoring": RiskScoringAgent(),
    "aml_screen": AMLAgent(),
    "decision": DecisionAgent(),
    "notification": NotificationAgent(),
}

WORKFLOW_CONFIGS_DIR = os.path.join(os.path.dirname(__file__), "workflow_configs")


def load_workflow_config(institution_id: str) -> dict:
    """Load YAML workflow config for institution, fall back to default."""
    config_path = os.path.join(WORKFLOW_CONFIGS_DIR, f"{institution_id}.yaml")
    if not os.path.exists(config_path):
        config_path = os.path.join(WORKFLOW_CONFIGS_DIR, "default.yaml")
    with open(config_path, "r") as f:
        return yaml.safe_load(f)


async def run_onboarding_pipeline(session_id: str, db) -> OnboardingSession:
    """
    Main pipeline entry point. Called after document upload.
    Runs all configured agents, updates session in DB, writes audit trail.
    """
    # Fetch session
    raw = await db["sessions"].find_one({"_id": session_id})
    if not raw:
        raise ValueError(f"Session {session_id} not found")
    session = OnboardingSession.from_mongo(raw)

    # Update status → PROCESSING
    session.status = SessionStatus.PROCESSING
    session.updated_at = datetime.utcnow()
    await db["sessions"].replace_one({"_id": session_id}, session.to_mongo())
    await write_audit(db, session_id, "pipeline_started", actor="orchestrator")

    # Load workflow config
    workflow_config = load_workflow_config(session.institution_id)
    steps = workflow_config.get("onboarding_steps", [])

    # Run each agent step
    for step in steps:
        agent_id = step["id"]
        step_config = step.get("config", {})

        agent = AGENT_REGISTRY.get(agent_id)
        if not agent:
            print(f"[ORCHESTRATOR] WARNING: Unknown agent '{agent_id}' — skipping")
            continue

        print(f"[ORCHESTRATOR] Running agent: {agent_id}")
        await write_audit(
            db, session_id, "agent_started",
            agent_id=agent_id, actor="orchestrator",
            input_data={"config": step_config}
        )

        result = await agent.execute(session, step_config)
        session.agent_results[agent_id] = result

        # Persist updated session after each agent
        session.updated_at = datetime.utcnow()
        await db["sessions"].replace_one({"_id": session_id}, session.to_mongo())

        await write_audit(
            db, session_id, "agent_completed",
            agent_id=agent_id, actor="orchestrator",
            input_data={"config": step_config},
            output_data=result.result,
            reasoning=result.result.get("reasoning") if result.result else None,
        )

        if result.status == AgentStatus.FAILED:
            print(f"[ORCHESTRATOR] Agent {agent_id} FAILED: {result.error}")
            session.status = SessionStatus.FAILED
            session.updated_at = datetime.utcnow()
            await db["sessions"].replace_one({"_id": session_id}, session.to_mongo())
            await write_audit(db, session_id, "pipeline_failed", agent_id=agent_id,
                              actor="orchestrator", reasoning=result.error)
            return session

    # Extract final decision from decision agent result
    decision_result = session.agent_results.get("decision")
    if decision_result and decision_result.result:
        decision = decision_result.result.get("decision", "MANUAL_REVIEW")
        session.final_decision = decision
        session.decision_reasoning = decision_result.result.get("reasoning")
        session.triggered_rules = decision_result.result.get("triggered_rules", [])
        session.risk_score = decision_result.result.get("risk_score")
        session.status = SessionStatus(decision)
    else:
        session.status = SessionStatus.MANUAL_REVIEW

    session.updated_at = datetime.utcnow()
    await db["sessions"].replace_one({"_id": session_id}, session.to_mongo())
    await write_audit(
        db, session_id, "pipeline_completed", actor="orchestrator",
        reasoning=session.decision_reasoning,
        output_data={"decision": session.final_decision, "risk_score": session.risk_score}
    )

    print(f"[ORCHESTRATOR] Pipeline complete for {session_id}: {session.status}")
    return session
