import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listSessions, getStats } from '../api/client';
import { CheckCircle, XCircle, Clock, TrendingUp, Users, Layers, Activity, Filter, Search, Download, RefreshCw, Eye, AlertTriangle, BarChart3, Settings, Mail, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import BulkOperations from '../components/BulkOperations';
import TemplateManager from '../components/TemplateManager';
import ApiMonitor from '../components/ApiMonitor';

function StatCard({ icon: Icon, label, value, color, sub, trend }: any) {
  return (
    <motion.div 
      className="metric-card"
      whileHover={{ y: -4 }}
      style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: color, filter: 'blur(40px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `inset 0 2px 8px ${color}10` }}>
          <Icon size={22} color={color} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: trend > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {trend > 0 ? <TrendingUp size={14} /> : <AlertTriangle size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2, letterSpacing: '-0.03em' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { class: string; icon: any; color: string }> = {
    APPROVED: { class: 'badge-approved', icon: CheckCircle, color: 'var(--accent-green)' },
    REJECTED: { class: 'badge-rejected', icon: XCircle, color: 'var(--accent-red)' },
    MANUAL_REVIEW: { class: 'badge-review', icon: Clock, color: 'var(--accent-amber)' },
    PROCESSING: { class: 'badge-processing', icon: RefreshCw, color: 'var(--accent-blue)' },
    PENDING: { class: 'badge-pending', icon: Clock, color: 'var(--text-muted)' },
  };
  const config = map[status] || map.PENDING;
  const Icon = config.icon;
  
  return (
    <span className={`badge ${config.class}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icon size={12} />
      {status.replace('_', ' ')}
    </span>
  );
}

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: () => getStats().then(r => r.data), refetchInterval: 8000 });
  const { data: sessionsData, isLoading, refetch } = useQuery({ queryKey: ['sessions'], queryFn: () => listSessions({ limit: 50 }).then(r => r.data), refetchInterval: 5000 });
  
  const sessions = sessionsData?.sessions || [];
  const filteredSessions = sessions.filter((s: any) => {
    const matchesSearch = !searchTerm || 
      s.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.session_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid var(--glass-border)', paddingBottom: 16 }}>
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'bulk', label: 'Bulk Operations', icon: Settings },
          { id: 'templates', label: 'Templates', icon: Mail },
          { id: 'monitoring', label: 'API Monitor', icon: Server },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn-ghost ${activeTab === tab.id ? 'active' : ''}`}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              padding: '10px 16px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : 'none',
              borderRadius: activeTab === tab.id ? '8px 8px 0 0' : 8,
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'analytics' ? (
        <AnalyticsDashboard />
      ) : activeTab === 'bulk' ? (
        <BulkOperations sessions={sessions} />
      ) : activeTab === 'templates' ? (
        <TemplateManager />
      ) : activeTab === 'monitoring' ? (
        <ApiMonitor />
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
            <StatCard icon={Users} label="Total Applications" value={stats?.total ?? '—'} color="var(--accent-blue)" trend={12} />
            <StatCard icon={CheckCircle} label="Approved" value={stats?.approved ?? '—'} color="var(--accent-green)" sub={stats ? `${stats.approval_rate}% approved` : ''} trend={8} />
            <StatCard icon={XCircle} label="Rejected" value={stats?.rejected ?? '—'} color="var(--accent-red)" trend={-3} />
            <StatCard icon={Clock} label="In Review" value={stats?.manual_review ?? '—'} color="var(--accent-amber)" trend={5} />
          </div>

      {/* Session table */}
      <motion.div 
        className="glass-card" 
        style={{ padding: '0', overflow: 'hidden' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Header with controls */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Layers size={18} color="var(--text-primary)" />
            <div style={{ fontWeight: 600, fontSize: 16 }}>Recent Sessions</div>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6 }}>
              {filteredSessions.length} of {sessionsData?.total ?? 0}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: 36, fontSize: 13, width: 200 }}
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
              style={{ fontSize: 13, width: 140 }}
            >
              <option value="all">All Status</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="MANUAL_REVIEW">Manual Review</option>
              <option value="PROCESSING">Processing</option>
              <option value="PENDING">Pending</option>
            </select>
            
            {/* Actions */}
            <button
              onClick={() => refetch()}
              className="btn-ghost"
              style={{ padding: '8px 12px' }}
              title="Refresh data"
            >
              <RefreshCw size={16} />
            </button>
            
            <button
              className="btn-ghost"
              style={{ padding: '8px 12px' }}
              title="Export data"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: 60, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Loading sessions...</div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <Activity size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
              {searchTerm || statusFilter !== 'all' ? 'No matching sessions found' : 'No sessions found'}
            </div>
            {searchTerm || statusFilter !== 'all' ? (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="btn-ghost"
                style={{ fontSize: 14 }}
              >
                Clear filters
              </button>
            ) : (
              <Link to="/onboarding" style={{ color: 'var(--accent-blue)', fontSize: 14 }}>Start a new onboarding session →</Link>
            )}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Applicant</th>
                <th>Status</th>
                <th>Risk Analysis</th>
                <th>Institution</th>
                <th>Session ID</th>
                <th style={{ paddingRight: 24 }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((s: any, index: number) => (
                <motion.tr 
                  key={s.session_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ cursor: 'pointer' }}
                  whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}
                >
                  <td style={{ paddingLeft: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 36, height: 36, borderRadius: '50%', 
                        background: `linear-gradient(135deg, ${s.status === 'APPROVED' ? 'var(--accent-green)' : s.status === 'REJECTED' ? 'var(--accent-red)' : 'var(--accent-blue)'}15)`, 
                        border: `1px solid ${s.status === 'APPROVED' ? 'var(--accent-green)' : s.status === 'REJECTED' ? 'var(--accent-red)' : 'var(--accent-blue)'}30`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: 14, fontWeight: 700, 
                        color: s.status === 'APPROVED' ? 'var(--accent-green)' : s.status === 'REJECTED' ? 'var(--accent-red)' : 'var(--accent-blue)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                      }}>
                        {s.applicant_name ? s.applicant_name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, marginBottom: 2 }}>{s.applicant_name || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.applicant_email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    {s.risk_score !== null && s.risk_score !== undefined ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 50, height: 6, background: 'var(--glass-border)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                          <motion.div 
                            style={{ 
                              height: '100%', 
                              width: `${s.risk_score * 100}%`, 
                              background: s.risk_score > 0.7 ? 'var(--accent-red)' : s.risk_score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)',
                              borderRadius: 3
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${s.risk_score * 100}%` }}
                            transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                          />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: s.risk_score > 0.7 ? 'var(--accent-red)' : s.risk_score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                          {(s.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.institution_id || 'default'}</td>
                  <td style={{ fontFamily: 'Space Grotesk, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{s.session_id.slice(0, 8)}...</span>
                      <button 
                        className="btn-ghost" 
                        style={{ padding: '2px 6px', fontSize: 10 }}
                        onClick={() => navigator.clipboard.writeText(s.session_id)}
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', paddingRight: 24 }}>
                    <div>
                      <div>{new Date(s.created_at).toLocaleDateString()}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
        </>
      )}
    </div>
  );
}
