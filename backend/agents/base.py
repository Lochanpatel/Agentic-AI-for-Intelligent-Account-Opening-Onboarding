from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from datetime import datetime
from models.session import OnboardingSession, AgentResult, AgentStatus


class BaseOnboardingAgent(ABC):
    """
    Base interface all onboarding agents must implement.
    Follows the plugin contract: any new agent just subclasses this.
    """

    @property
    @abstractmethod
    def agent_id(self) -> str:
        """Unique identifier for this agent."""
        ...

    @abstractmethod
    async def execute(
        self,
        session: OnboardingSession,
        config: Dict[str, Any],
    ) -> AgentResult:
        """
        Run this agent's logic against the session.
        Must return an AgentResult — never raise (catch internally and set status=FAILED).
        """
        ...

    async def health_check(self) -> Dict[str, Any]:
        return {"agent": self.agent_id, "status": "healthy"}

    def _make_result(
        self,
        status: AgentStatus,
        result: Optional[Dict] = None,
        error: Optional[str] = None,
        started_at: Optional[datetime] = None,
    ) -> AgentResult:
        return AgentResult(
            agent_id=self.agent_id,
            status=status,
            result=result,
            error=error,
            started_at=started_at,
            completed_at=datetime.utcnow(),
        )
