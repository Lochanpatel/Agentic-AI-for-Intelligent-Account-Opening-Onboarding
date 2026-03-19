import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getReviewQueue, submitReviewDecision } from '../api/client';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function RiskBar({ score }: { score: number }) {
  const color = score > 0.7 ? 'var(--accent-red)' : score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>Risk Score</span><span style={{ color, fontWeight: 600 }}>{(score * 100).toFixed(1)}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--glass-border)', borderRadius: 3 }}>
        <div style={{ height: '100%', background: color, borderRadius: 3, width: `${score * 100}%`, transition: 'width 0.6s' }} />
      </div>
    </div>
  );
}

function ReviewCard({ session, onDecision }: { session: any; onDecision: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const decide = async (decision: 'APPROVED' | 'REJECTED') => {
    setLoading(true);
    try {
      await submitReviewDecision(session.session_id, { decision, reviewer_id: 'reviewer-1', note });
      qc.invalidateQueries({ queryKey: ['reviewQueue'] });
      onDecision();
    } catch { alert('Failed to submit decision'); }
    finally { setLoading(false); }
  };

  return (
    <motion.div className="glass-card" style={{ padding: '24px', marginBottom: 16 }} layout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            {session.applicant_name || 'Unknown Applicant'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{session.applicant_email}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="badge badge-review" style={{ fontSize: 11 }}>
            <Clock size={10} /> REVIEW REQUIRED
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Risk bar */}
      {session.risk_score !== undefined && <RiskBar score={session.risk_score} />}

      {/* Triggered rules */}
      {session.triggered_rules?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {session.triggered_rules.map((r: string) => (
            <span key={r} style={{ padding: '3px 8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6, fontSize: 11, color: 'var(--accent-amber)' }}>
              {r.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Expanded: AI reasoning + agent details */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            {session.decision_reasoning && (
              <div style={{ marginTop: 16, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 6 }}>AI REASONING</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{session.decision_reasoning}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviewer note */}
      <textarea
        className="form-input" placeholder="Add reviewer notes (optional)..."
        value={note} onChange={e => setNote(e.target.value)}
        style={{ marginTop: 16, height: 72, resize: 'none', fontSize: 13 }}
      />

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className="btn-success" onClick={() => decide('APPROVED')} disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <CheckCircle size={14} /> Approve
        </button>
        <button className="btn-danger" onClick={() => decide('REJECTED')} disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <XCircle size={14} /> Reject
        </button>
      </div>
    </motion.div>
  );
}

export default function ReviewerDashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ['reviewQueue'], queryFn: () => getReviewQueue().then(r => r.data), refetchInterval: 5000 });
  const queue = data?.queue || [];

  return (
    <div className="page" style={{ padding: '80px 40px 60px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Reviewer</span> Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Human-in-the-loop review queue — AI-escalated cases requiring manual decision</p>
      </div>

      {/* Queue count */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
        <AlertTriangle size={22} color="var(--accent-amber)" />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>{data?.total ?? '—'}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Applications awaiting review</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>Auto-refreshes every 5s</div>
      </div>

      {isLoading && <div style={{ textAlign: 'center', padding: 40 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}
      {error && <div style={{ color: 'var(--accent-red)', padding: 20 }}>Failed to load queue. Is the backend running?</div>}
      {!isLoading && queue.length === 0 && (
        <div className="glass-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle size={40} color="var(--accent-green)" style={{ marginBottom: 12 }} />
          <div style={{ fontWeight: 600 }}>Queue is empty — all caught up!</div>
        </div>
      )}
      {queue.map((s: any) => (
        <ReviewCard key={s.session_id} session={s} onDecision={() => { }} />
      ))}
    </div>
  );
}
