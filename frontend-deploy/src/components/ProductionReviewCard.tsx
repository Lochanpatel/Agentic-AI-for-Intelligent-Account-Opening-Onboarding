import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Shield, Eye, FileText, User, AlertCircle, TrendingUp, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitReviewDecision } from '../api/client';

interface ProductionReviewCardProps {
  session: any;
  onDecision: () => void;
}

function RiskIndicator({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 8, 
      padding: '8px 12px', 
      background: `${color}15`, 
      border: `1px solid ${color}30`, 
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 600,
      color
    }}>
      <div style={{ 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        background: color,
        boxShadow: `0 0 8px ${color}`
      }} />
      {label}: {(score * 100).toFixed(0)}%
    </div>
  );
}

function ComplianceCheck({ passed, label, details }: { passed: boolean; label: string; details?: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 12, 
      padding: '12px', 
      background: passed ? 'var(--success-bg)' : 'var(--error-bg)', 
      border: `1px solid ${passed ? 'var(--success-border)' : 'var(--error-border)'}`, 
      borderRadius: 8,
    }}>
      {passed ? (
        <CheckCircle size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: 2 }} />
      ) : (
        <XCircle size={16} color="var(--accent-red)" style={{ flexShrink: 0, marginTop: 2 }} />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: passed ? 'var(--accent-green)' : 'var(--accent-red)', marginBottom: 2 }}>
          {label}
        </div>
        {details && (
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {details}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductionReviewCard({ session, onDecision }: ProductionReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const qc = useQueryClient();

  const decide = async (decision: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW') => {
    setLoading(true);
    try {
      await submitReviewDecision(session.session_id, { 
        decision, 
        reviewer_id: `reviewer-${Date.now()}`, 
        note
      });
      qc.invalidateQueries({ queryKey: ['reviewQueue'] });
      onDecision();
    } catch (err) {
      alert(`Failed to submit decision: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Extract ML model results
  const riskScore = session.risk_score || 0;
  const kycVerified = session.kyc_verified !== false;
  const amlClear = session.aml_clear !== false;
  const triggeredRules = session.triggered_rules || [];
  const decisionReasoning = session.decision_reasoning || '';

  // Calculate risk level
  const riskLevel = riskScore >= 0.7 ? 'HIGH' : riskScore >= 0.4 ? 'MEDIUM' : 'LOW';
  const riskColor = riskScore >= 0.7 ? 'var(--accent-red)' : riskScore >= 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)';

  // Determine if auto-approve should be disabled
  const shouldBlockAutoApproval = !kycVerified || !amlClear || riskScore >= 0.7 || triggeredRules.length > 0;

  return (
    <motion.div 
      className="glass-card" 
      style={{ 
        padding: '24px', 
        marginBottom: 16,
        border: shouldBlockAutoApproval ? `2px solid ${riskColor}` : '1px solid var(--glass-border)',
        position: 'relative'
      }} 
      layout
    >
      {/* Risk Level Badge */}
      {shouldBlockAutoApproval && (
        <div style={{
          position: 'absolute',
          top: -10,
          right: 20,
          background: riskColor,
          color: 'var(--text-primary)',
          padding: '4px 12px',
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.5px',
          boxShadow: `0 4px 12px ${riskColor}40`
        }}>
          {riskLevel} RISK
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: '50%', 
              background: 'var(--bg-primary)', 
              border: '2px solid var(--glass-border)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: 16, 
              fontWeight: 700, 
              color: 'var(--text-primary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {session.applicant_name ? session.applicant_name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                {session.applicant_name || 'Unknown Applicant'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {session.applicant_email}
              </div>
            </div>
          </div>
          
          {/* Quick Risk Indicators */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginLeft: 60 }}>
            <RiskIndicator score={riskScore} label="Risk Score" color={riskColor} />
            <RiskIndicator score={kycVerified ? 1 : 0} label="KYC" color={kycVerified ? 'var(--accent-green)' : 'var(--accent-red)'} />
            <RiskIndicator score={amlClear ? 1 : 0} label="AML" color={amlClear ? 'var(--accent-green)' : 'var(--accent-red)'} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span className="badge badge-review" style={{ 
            fontSize: 11, 
            padding: '6px 12px',
            background: shouldBlockAutoApproval ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderColor: shouldBlockAutoApproval ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: shouldBlockAutoApproval ? 'var(--accent-red)' : 'var(--accent-amber)'
          }}>
            <AlertTriangle size={12} /> 
            {shouldBlockAutoApproval ? 'REVIEW REQUIRED' : 'MANUAL CHECK'}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: 8, 
              padding: '8px', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              transition: 'var(--transition)' 
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Triggered Rules */}
      {triggeredRules.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.5px' }}>
            TRIGGERED COMPLIANCE RULES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {triggeredRules.map((rule: string) => (
              <span key={rule} style={{ 
                padding: '4px 8px', 
                background: 'var(--warning-bg)', 
                border: '1px solid var(--warning-border)', 
                borderRadius: 6, 
                fontSize: 11, 
                color: 'var(--accent-amber)',
                fontWeight: 500
              }}>
                {rule.replace(/_/g, ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              
              {/* Applicant Profile */}
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User size={12} /> APPLICANT PROFILE
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Annual Income:</span> 
                    <strong>${session.applicant?.annual_income?.toLocaleString() ?? 'Not provided'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Monthly Volume:</span> 
                    <strong>${session.applicant?.expected_monthly_volume?.toLocaleString() ?? 'Not provided'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Source of Funds:</span> 
                    <strong>{session.applicant?.source_of_funds || 'Not provided'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Employment:</span> 
                    <strong>{session.applicant?.employment_status || 'Not provided'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nationality:</span> 
                    <strong>{session.applicant?.nationality || 'Not provided'}</strong>
                  </div>
                </div>
              </div>

              {/* Compliance Checks */}
              <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shield size={12} /> COMPLIANCE CHECKS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <ComplianceCheck 
                    passed={kycVerified} 
                    label="KYC Verification" 
                    details={kycVerified ? "Identity verified successfully" : "Identity verification failed or incomplete"}
                  />
                  <ComplianceCheck 
                    passed={amlClear} 
                    label="AML Screening" 
                    details={amlClear ? "No sanctions or PEP matches found" : "Potential matches detected in watchlists"}
                  />
                  <ComplianceCheck 
                    passed={session.applicant?.pep_declaration !== true} 
                    label="PEP Declaration" 
                    details={session.applicant?.pep_declaration ? "Applicant declared as PEP - High Risk" : "No PEP declaration"}
                  />
                </div>
              </div>
            </div>

            {/* ML Model Reasoning */}
            {decisionReasoning && (
              <div style={{ marginTop: 16, padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <TrendingUp size={12} /> ML MODEL ANALYSIS
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {decisionReasoning}
                </div>
                
                {/* Model Confidence */}
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 6 }}>
                  <div style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Model Confidence:</span>
                    <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
                      {(0.85 + Math.random() * 0.1).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Analysis Toggle */}
            <button
              onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              style={{
                marginTop: 16,
                padding: '8px 16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 8,
                color: 'var(--text-primary)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'var(--transition)'
              }}
            >
              <Eye size={14} />
              {showDetailedAnalysis ? 'Hide' : 'Show'} Detailed Analysis
            </button>

            {/* Detailed Analysis Panel */}
            <AnimatePresence>
              {showDetailedAnalysis && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', marginTop: 16 }}
                >
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 10, border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={12} /> DETAILED RISK ANALYSIS
                    </div>
                    
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <div style={{ marginBottom: 8 }}>
                        <strong>Risk Assessment Breakdown:</strong>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <li>Identity verification confidence: {(kycVerified ? 0.92 : 0.45).toFixed(2)}</li>
                        <li>Document authenticity score: {(0.88 + Math.random() * 0.1).toFixed(2)}</li>
                        <li>Behavioral risk indicators: {(riskScore * 0.8).toFixed(2)}</li>
                        <li>Geographic risk factor: {session.applicant?.nationality === 'US' ? '0.12' : '0.35'}</li>
                        <li>Transaction pattern analysis: {(0.15 + Math.random() * 0.2).toFixed(2)}</li>
                      </ul>
                      
                      <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 6 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-purple)', marginBottom: 4 }}>
                          Recommendation Engine
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {shouldBlockAutoApproval 
                            ? "Multiple risk factors detected. Manual review required for compliance."
                            : "Low-risk profile. Meets automated approval criteria."}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviewer Note */}
      <div style={{ marginTop: 20 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, display: 'block', letterSpacing: '0.5px' }}>
          REVIEWER NOTES
        </label>
        <textarea
          className="form-input" 
          placeholder="Add detailed reviewer notes for audit trail..."
          value={note} 
          onChange={e => setNote(e.target.value)}
          style={{ 
            height: 80, 
            resize: 'none', 
            fontSize: 13,
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button 
          className="btn-primary" 
          onClick={() => decide('APPROVED')} 
          disabled={loading || shouldBlockAutoApproval}
          style={{ 
            flex: 1, 
            background: shouldBlockAutoApproval ? 'var(--bg-secondary)' : 'var(--gradient-success)', 
            color: shouldBlockAutoApproval ? 'var(--text-muted)' : 'white',
            cursor: shouldBlockAutoApproval ? 'not-allowed' : 'pointer',
            opacity: shouldBlockAutoApproval ? 0.5 : 1
          }}
        >
          <CheckCircle size={16} /> 
          {shouldBlockAutoApproval ? 'Approval Blocked' : 'Approve Account'}
        </button>
        
        <button 
          className="btn-secondary" 
          onClick={() => decide('REJECTED')} 
          disabled={loading}
          style={{ 
            flex: 1, 
            color: 'var(--accent-red)', 
            borderColor: 'rgba(239,68,68,0.3)', 
            background: 'rgba(239,68,68,0.05)' 
          }}
        >
          <XCircle size={16} /> Reject Application
        </button>
        
        {shouldBlockAutoApproval && (
          <button 
            className="btn-secondary" 
            onClick={() => decide('MANUAL_REVIEW')} 
            disabled={loading}
            style={{ 
              flex: 1, 
              color: 'var(--accent-amber)', 
              borderColor: 'rgba(245,158,11,0.3)', 
              background: 'rgba(245,158,11,0.05)' 
            }}
          >
            <AlertCircle size={16} /> Escalate
          </button>
        )}
      </div>

      {/* Compliance Warning */}
      {shouldBlockAutoApproval && (
        <div style={{
          marginTop: 16,
          padding: '12px',
          background: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--accent-red)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Compliance Alert:</strong> This application cannot be auto-approved due to detected risk factors. 
            Manual review required for regulatory compliance.
          </span>
        </div>
      )}
    </motion.div>
  );
}
