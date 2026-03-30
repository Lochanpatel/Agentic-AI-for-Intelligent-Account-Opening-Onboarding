import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Download, Mail, AlertTriangle, Users, Clock, BarChart3, Filter, Search, RefreshCw, Trash2, Archive } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BulkOperation {
  id: string;
  type: 'approve' | 'reject' | 'email' | 'export' | 'delete' | 'archive';
  targetCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
}

interface Session {
  session_id: string;
  applicant_name: string;
  applicant_email: string;
  status: string;
  risk_score: number;
  institution_id: string;
  created_at: string;
  selected?: boolean;
}

export default function BulkOperations({ sessions }: { sessions: Session[] }) {
  const { t } = useLanguage();
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<BulkOperation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showOperations, setShowOperations] = useState(false);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = !searchTerm || 
      session.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.applicant_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.session_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredSessions.map(s => s.session_id)));
    }
  };

  const handleSelectSession = (sessionId: string) => {
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(sessionId)) {
      newSelected.delete(sessionId);
    } else {
      newSelected.add(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  const executeBulkOperation = async (type: BulkOperation['type']) => {
    if (selectedSessions.size === 0) return;

    const operation: BulkOperation = {
      id: Date.now().toString(),
      type,
      targetCount: selectedSessions.size,
      status: 'processing',
      progress: 0,
      startTime: new Date(),
    };

    setBulkOperations(prev => [operation, ...prev]);
    setCurrentOperation(operation);

    // Simulate bulk operation
    const sessionIds = Array.from(selectedSessions);
    for (let i = 0; i < sessionIds.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBulkOperations(prev => prev.map(op => 
        op.id === operation.id 
          ? { ...op, progress: Math.round(((i + 1) / sessionIds.length) * 100) }
          : op
      ));
    }

    // Complete operation
    setBulkOperations(prev => prev.map(op => 
      op.id === operation.id 
        ? { ...op, status: 'completed', progress: 100, endTime: new Date() }
        : op
    ));

    setCurrentOperation(null);
    setSelectedSessions(new Set());
  };

  const exportSelectedData = () => {
    const selectedData = filteredSessions.filter(s => selectedSessions.has(s.session_id));
    const csv = [
      ['Session ID', 'Applicant Name', 'Email', 'Status', 'Risk Score', 'Institution', 'Created At'],
      ...selectedData.map(s => [
        s.session_id,
        s.applicant_name,
        s.applicant_email,
        s.status,
        s.risk_score,
        s.institution_id,
        new Date(s.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'var(--accent-green)';
      case 'REJECTED': return 'var(--accent-red)';
      case 'MANUAL_REVIEW': return 'var(--accent-amber)';
      case 'PROCESSING': return 'var(--accent-blue)';
      default: return 'var(--text-muted)';
    }
  };

  const getOperationIcon = (type: BulkOperation['type']) => {
    switch (type) {
      case 'approve': return CheckSquare;
      case 'reject': return AlertTriangle;
      case 'email': return Mail;
      case 'export': return Download;
      case 'delete': return Trash2;
      case 'archive': return Archive;
      default: return RefreshCw;
    }
  };

  const getOperationLabel = (type: BulkOperation['type']) => {
    switch (type) {
      case 'approve': return 'Bulk Approve';
      case 'reject': return 'Bulk Reject';
      case 'email': return 'Send Emails';
      case 'export': return 'Export Data';
      case 'delete': return 'Delete Records';
      case 'archive': return 'Archive Records';
      default: return 'Unknown Operation';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Bulk Operations</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            {selectedSessions.size} of {filteredSessions.length} sessions selected
          </p>
        </div>
        <button
          onClick={() => setShowOperations(!showOperations)}
          className="btn-ghost"
          style={{ padding: '8px 12px' }}
        >
          {showOperations ? 'Hide' : 'Show'} Operations
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
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
        </select>

        <button
          onClick={handleSelectAll}
          className="btn-ghost"
          style={{ padding: '8px 12px', fontSize: 13 }}
        >
          {selectedSessions.size === filteredSessions.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Bulk Actions */}
      {selectedSessions.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '16px', marginBottom: 20 }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
              Bulk Actions:
            </span>
            <button
              onClick={() => executeBulkOperation('approve')}
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: 12 }}
              disabled={currentOperation !== null}
            >
              <CheckSquare size={14} style={{ marginRight: 4 }} /> Approve
            </button>
            <button
              onClick={() => executeBulkOperation('reject')}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: 12, background: 'var(--accent-red)', color: 'var(--text-primary)', border: 'none' }}
              disabled={currentOperation !== null}
            >
              <AlertTriangle size={14} style={{ marginRight: 4 }} /> Reject
            </button>
            <button
              onClick={() => executeBulkOperation('email')}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: 12 }}
              disabled={currentOperation !== null}
            >
              <Mail size={14} style={{ marginRight: 4 }} /> Send Email
            </button>
            <button
              onClick={exportSelectedData}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              <Download size={14} style={{ marginRight: 4 }} /> Export
            </button>
            <button
              onClick={() => executeBulkOperation('archive')}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: 12 }}
              disabled={currentOperation !== null}
            >
              <Archive size={14} style={{ marginRight: 4 }} /> Archive
            </button>
          </div>
        </motion.div>
      )}

      {/* Current Operation Progress */}
      {currentOperation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '16px', marginBottom: 20 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div className="spinner" style={{ width: 16, height: 16 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {getOperationLabel(currentOperation.type)} in progress...
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
              {currentOperation.progress}% ({currentOperation.progress}/{currentOperation.targetCount})
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--glass-border)', borderRadius: 2 }}>
            <div
              style={{
                height: '100%',
                background: 'var(--gradient-primary)',
                borderRadius: 2,
                width: `${currentOperation.progress}%`,
                transition: 'width 0.3s'
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Operations History */}
      {showOperations && bulkOperations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '20px', marginBottom: 20 }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Operations History</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bulkOperations.map((operation) => {
              const Icon = getOperationIcon(operation.type);
              return (
                <div
                  key={operation.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 6,
                    fontSize: 13
                  }}
                >
                  <Icon size={16} color={getStatusColor(operation.status)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{getOperationLabel(operation.type)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {operation.targetCount} items • {operation.status}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {operation.startTime && new Date(operation.startTime).toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Sessions List */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} />
            <span style={{ fontWeight: 500 }}>Select Sessions</span>
          </div>
        </div>
        
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {filteredSessions.map((session) => (
            <div
              key={session.session_id}
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                background: selectedSessions.has(session.session_id) ? 'var(--accent-blue)10' : 'transparent'
              }}
              onClick={() => handleSelectSession(session.session_id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectSession(session.session_id);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {selectedSessions.has(session.session_id) ? (
                  <CheckSquare size={16} color="var(--accent-blue)" />
                ) : (
                  <Square size={16} color="var(--text-muted)" />
                )}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{session.applicant_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{session.applicant_email}</div>
              </div>
              
              <div style={{ 
                padding: '4px 8px', 
                borderRadius: 4, 
                fontSize: 11, 
                fontWeight: 600,
                background: `${getStatusColor(session.status)}15`,
                color: getStatusColor(session.status)
              }}>
                {session.status}
              </div>
              
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {session.risk_score !== null ? `${(session.risk_score * 100).toFixed(0)}%` : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
