from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Any
import uuid


class AuditEntry(BaseModel):
    entry_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    agent_id: Optional[str] = None
    action: str
    actor: str = "system"
    input_data: Optional[Any] = None
    output_data: Optional[Any] = None
    reasoning: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    def to_mongo(self) -> dict:
        data = self.model_dump()
        data["_id"] = data.pop("entry_id")
        return data


async def write_audit(db, session_id: str, action: str, agent_id: str = None,
                      actor: str = "system", input_data=None, output_data=None, reasoning: str = None):
    entry = AuditEntry(
        session_id=session_id,
        agent_id=agent_id,
        action=action,
        actor=actor,
        input_data=input_data,
        output_data=output_data,
        reasoning=reasoning,
    )
    await db["audit_logs"].insert_one(entry.to_mongo())
    return entry
