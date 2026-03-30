import React, { useEffect } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getSession } from '../../api/client';
import { CheckCircle, XCircle, Clock, Loader, SkipForward } from 'lucide-react';

const AGENT_LABELS: Record<string, string> = {
  doc_ingestion: 'Document OCR & Extraction',
  kyc_check: 'KYC Identity Verification',
  risk_scoring: 'Risk Assessment',
  aml_screen: 'AML & Sanctions Screening',
  decision: 'AI Decision Engine',
  notification: 'Notification Sent',
};

const TERMINAL_STATUSES = ['APPROVED', 'REJECTED', 'MANUAL_REVIEW', 'FAILED'];

function AgentRow({ agentId, result }: { agentId: string; result: any }) {
  const status = result?.status || 'pending';
  const icon = {
    completed: <CheckCircle size={16} color="var(--accent-green)" />,
    failed: <XCircle size={16} color="var(--accent-red)" />,
    skipped: <SkipForward size={16} color="var(--text-muted)" />,
    running: <Loader size={16} color="var(--accent-blue)" style={{ animation: 'spin 1s linear infinite' }} />,
    pending: <Clock size={16} color="var(--text-muted)" />,
  }[status] || <Clock size={16} color="var(--text-muted)" />;

  const colors: Record<string, string> = {
    completed: 'var(--accent-green)', failed: 'var(--accent-red)',
    running: 'var(--accent-blue)', skipped: 'var(--text-muted)', pending: 'var(--text-muted)',
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
      background: status === 'running' ? 'rgba(59,130,246,0.05)' : 'transparent',
      borderRadius: 10, transition: 'background 0.2s',
      borderLeft: `3px solid ${status !== 'pending' ? colors[status] : 'transparent'}`,
    }}>
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
          {AGENT_LABELS[agentId] || agentId}
        </div>
        {result?.result?.reasoning && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>
            {result.result.reasoning}
          </div>
        )}
        {result?.error && <div style={{ fontSize: 12, color: 'var(--accent-red)', marginTop: 2 }}>{result.error}</div>}
      </div>
      {result?.result?.risk_score !== undefined && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          Risk: {(result.result.risk_score * 100).toFixed(0)}%
        </span>
      )}
      {result?.result?.confidence_score !== undefined && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
          KYC: {(result.result.confidence_score * 100).toFixed(0)}%
        </span>
      )}
      <span style={{ fontSize: 11, fontWeight: 600, color: colors[status], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {status}
      </span>
    </div>
  );
}

export default function Step3Processing() {
  const { sessionId, setSession, setStep, session } = useOnboardingStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const poll = async () => {
      if (!sessionId) return;
      try {
        const res = await getSession(sessionId);
        setSession(res.data);
        if (TERMINAL_STATUSES.includes(res.data.status)) {
          clearInterval(interval);
          console.log('Processing complete, moving to decision step. Status:', res.data.status);
          setTimeout(() => setStep(6), 1000); // Go to decision step (6), not video step (4)
        }
      } catch { }
    };
    poll();
    interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [sessionId]);

  const agentOrder = ['doc_ingestion', 'kyc_check', 'risk_scoring', 'aml_screen', 'decision', 'notification'];
  const agentResults = session?.agent_results || {};
  const isProcessing = session?.status === 'PROCESSING';

  return (
    <div className="glass-card" style={{ padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        {isProcessing ? (
          <>
            <div className="spinner" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>AI Agents Working</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Verifying your identity and assessing risk in real time...
            </p>
          </>
        ) : (
          <>
            <CheckCircle size={48} color="var(--accent-green)" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Analysis Complete</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Redirecting to your decision...</p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {agentOrder.map(id => (
          <AgentRow key={id} agentId={id} result={agentResults[id]} />
        ))}
      </div>

      {session?.risk_score !== undefined && (
        <div style={{ marginTop: 24, padding: '16px 20px', background: 'var(--glass-border)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>Overall Risk Score</span>
          <span style={{
            fontSize: 20, fontWeight: 700,
            color: session.risk_score > 0.7 ? 'var(--accent-red)' : session.risk_score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)'
          }}>
            {(session.risk_score * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}
