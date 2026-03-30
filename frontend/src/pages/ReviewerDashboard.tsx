import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getReviewQueue, submitReviewDecision } from '../api/client';
import { Clock, CheckCircle, XCircle, AlertTriangle, Shield, Settings, BarChart3, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductionReviewCard from '../components/ProductionReviewCard';

export default function ReviewerDashboard() {
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['reviewQueue'], 
    queryFn: () => getReviewQueue().then(r => r.data), 
    refetchInterval: 10000 // Refresh every 10 seconds for real-time monitoring
  });
  const queue = data?.queue || [];

  return (
    <div className="page" style={{ padding: '80px 40px 60px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          <span className="gradient-text">Compliance Review</span> Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Banking-grade KYC/AML review system with ML-powered risk assessment
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} color="var(--accent-amber)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{data?.total || 0}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pending Review</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--error-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} color="var(--accent-red)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{queue.filter(q => q.risk_score > 70).length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>High Risk</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} color="var(--accent-green)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{queue.filter(q => q.decision === 'APPROVED').length}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Approved Today</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--info-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="var(--accent-blue)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(queue.reduce((acc, q) => acc + (q.risk_score || 0), 0) / queue.length) || 0}%</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Compliance Score</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Settings size={16} /> Configure Rules
        </button>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart3 size={16} /> Risk Analytics
        </button>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={16} /> Audit Log
        </button>
      </div>

      {/* Queue Header */}
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <AlertTriangle size={22} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Review Queue</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Applications requiring human review</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)', animation: 'pulse 2s infinite' }} />
          Auto-refreshes every 10s
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-secondary)' }}>Loading review queue...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--accent-red)' }}>
          <AlertTriangle size={40} style={{ marginBottom: 16 }} />
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Failed to load queue</div>
          <div style={{ fontSize: 13 }}>Please check if the backend service is running</div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && queue.length === 0 && (
        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle size={48} color="var(--accent-green)" style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>All Caught Up!</div>
          <div style={{ fontSize: 14 }}>No applications currently require review</div>
        </div>
      )}

      {/* Review Queue */}
      {!isLoading && !error && queue.map((session: any) => (
        <ProductionReviewCard 
          key={session.session_id} 
          session={session} 
          onDecision={() => {}} 
        />
      ))}

      {/* Footer Info */}
      {!isLoading && !error && queue.length > 0 && (
        <div style={{ marginTop: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Shield size={14} />
            <span>Banking-grade compliance system with ML-powered risk assessment</span>
          </div>
          <div style={{ marginTop: 8 }}>
            All decisions are logged for audit and regulatory compliance
          </div>
        </div>
      )}
    </div>
  );
}
