import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Types ───────────────────────────────────────────────
export interface ApplicantInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  address: string;
}

export interface AgentResult {
  agent_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: Record<string, any>;
  error?: string;
  started_at?: string;
  completed_at?: string;
}

export interface OnboardingSession {
  session_id: string;
  institution_id: string;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'FAILED';
  applicant?: ApplicantInfo;
  document_path?: string;
  document_type?: string;
  agent_results: Record<string, AgentResult>;
  risk_score?: number;
  final_decision?: string;
  decision_reasoning?: string;
  triggered_rules?: string[];
  reviewer_id?: string;
  reviewer_note?: string;
  created_at: string;
  updated_at: string;
}

export interface SessionStats {
  total: number;
  approved: number;
  rejected: number;
  manual_review: number;
  processing: number;
  pending: number;
  approval_rate: number;
}

// ─── API calls ───────────────────────────────────────────
export const createSession = (data: { institution_id?: string; applicant: ApplicantInfo }) =>
  api.post<{ session_id: string; status: string; created_at: string }>('/sessions', data);

export const getSession = (id: string) =>
  api.get<OnboardingSession>(`/sessions/${id}`);

export const listSessions = (params?: { status?: string; limit?: number }) =>
  api.get<{ sessions: any[]; total: number }>('/sessions', { params });

export const getStats = () =>
  api.get<SessionStats>('/sessions/stats/overview');

export const uploadDocument = (sessionId: string, file: File, documentType: string) => {
  const form = new FormData();
  form.append('file', file);
  form.append('document_type', documentType);
  return api.post(`/sessions/${sessionId}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getReviewQueue = () =>
  api.get<{ queue: any[]; total: number }>('/review/queue');

export const submitReviewDecision = (sessionId: string, data: { decision: string; reviewer_id: string; note?: string }) =>
  api.post(`/review/${sessionId}/decision`, data);

export const getAuditTrail = (sessionId: string) =>
  api.get(`/audit/${sessionId}`);
