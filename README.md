# 🏦 Agentic AI for Intelligent Account Opening & Onboarding

> An end-to-end AI-powered account onboarding platform with autonomous AI agents for KYC, document parsing, risk scoring, AML screening, and compliant decision-making.

---

## 🏗️ Architecture

```
Frontend (React + Vite)
    ↓
Backend (FastAPI + LangGraph Agents)
    ↓
MongoDB (Session State + Audit Log)

Agents Pipeline:
  DocIngestion → KYC → RiskScoring → AMLScreen → Decision → Notification
```

## ⚡ Quick Start

### Prerequisites
- Docker + Docker Compose
- (Optional) OpenAI API Key for real LLM decisions

### 1. Clone & Configure

```bash
cp .env.example .env
# Edit .env — add OPENAI_API_KEY if you have one
# SIMULATE_OCR=true, SIMULATE_KYC=true, SIMULATE_AML=true by default (no API keys needed)
```

### 2. Run

```bash
docker-compose up --build
```

### 3. Access

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## 📁 Project Structure

```
├── backend/
│   ├── agents/          # AI agent modules
│   ├── api/             # FastAPI route handlers
│   ├── core/            # Config, DB, utilities
│   ├── models/          # MongoDB document models
│   ├── orchestrator/    # LangGraph-style workflow engine
│   └── tests/           # pytest test suite
├── frontend/
│   ├── src/
│   │   ├── components/  # Shared UI components
│   │   ├── pages/       # Landing, Onboarding, Reviewer, Admin
│   │   ├── store/       # Zustand state management
│   │   └── api/         # API client
└── docker-compose.yml
```

---

## 🤖 AI Agents

| Agent | Role |
|---|---|
| **DocIngestion** | OCR + field extraction from uploaded documents |
| **KYC** | Identity verification (Onfido-compatible) |
| **RiskScoring** | Rule-based + LLM risk assessment |
| **AML/Compliance** | Sanctions list check + policy RAG |
| **Decision** | LLM synthesises all signals → APPROVE/REJECT/MANUAL_REVIEW |
| **Notification** | Email/SMS confirmation (SendGrid-compatible) |

---

## 🧪 Running Tests

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

---

## 🔐 Security Notes

- All PII is stored encrypted (AES-256 at rest in production)
- Every agent decision is written to an immutable audit log
- Human-in-the-loop reviewer dashboard for MANUAL_REVIEW cases
- Full GDPR erasure support built-in

---

## 🗺️ Workflow Config

Each institution gets its own `workflow_config.yaml`:

```yaml
institution_id: bank_a
onboarding_steps:
  - id: doc_ingestion
  - id: kyc_check
    provider: simulated
  - id: risk_scoring
    threshold: 0.70
  - id: aml_screen
    enabled: true
  - id: decision
  - id: notification
```

---

*Built with FastAPI · React · LangGraph · MongoDB · Docker*
