import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listSessions, getStats } from '../api/client';
import { CheckCircle, XCircle, Clock, TrendingUp, Users, Layers, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color, sub }: any) {
  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    APPROVED: 'badge-approved', REJECTED: 'badge-rejected',
    MANUAL_REVIEW: 'badge-review', PROCESSING: 'badge-processing', PENDING: 'badge-pending',
  };
  return <span className={`badge ${map[status] || 'badge-pending'}`}>{status.replace('_', ' ')}</span>;
}

export default function AdminDashboard() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: () => getStats().then(r => r.data), refetchInterval: 8000 });
  const { data: sessionsData, isLoading } = useQuery({ queryKey: ['sessions'], queryFn: () => listSessions({ limit: 30 }).then(r => r.data), refetchInterval: 5000 });
  const sessions = sessionsData?.sessions || [];

  return (
    <div className="page" style={{ padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span className="gradient-text">Admin</span> Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Live onboarding session monitoring — refreshes every 5s</p>
        </div>
        <Link to="/reviewer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={15} /> Review Queue
          {(stats?.manual_review ?? 0) > 0 && (
            <span style={{ background: 'var(--accent-amber)', color: '#000', borderRadius: '999px', padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>
              {stats?.manual_review}
            </span>
          )}
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 36 }}>
        <StatCard icon={Users} label="Total Applications" value={stats?.total ?? '—'} color="var(--accent-blue)" />
        <StatCard icon={CheckCircle} label="Approved" value={stats?.approved ?? '—'} color="var(--accent-green)" sub={stats ? `${stats.approval_rate}% approval rate` : ''} />
        <StatCard icon={XCircle} label="Rejected" value={stats?.rejected ?? '—'} color="var(--accent-red)" />
        <StatCard icon={Clock} label="In Review" value={stats?.manual_review ?? '—'} color="var(--accent-amber)" />
        <StatCard icon={Activity} label="Processing" value={stats?.processing ?? '—'} color="var(--accent-cyan)" />
        <StatCard icon={TrendingUp} label="Approval Rate" value={stats ? `${stats.approval_rate}%` : '—'} color="var(--accent-purple)" />
      </div>

      {/* Session table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>
            <Layers size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Recent Sessions
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sessionsData?.total ?? 0} total</span>
        </div>

        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No sessions yet. <Link to="/onboarding" style={{ color: 'var(--accent-blue)' }}>Start onboarding →</Link>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Institution</th>
                <th>Session ID</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s: any) => (
                <tr key={s.session_id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{s.applicant_name || '—'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.applicant_email}</div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {s.risk_score !== null && s.risk_score !== undefined ? (
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, color: s.risk_score > 0.7 ? 'var(--accent-red)' : s.risk_score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                        {(s.risk_score * 100).toFixed(1)}%
                      </span>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ fontSize: 13 }}>{s.institution_id}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{s.session_id.slice(0, 8)}...</td>
                  <td style={{ fontSize: 12 }}>{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
