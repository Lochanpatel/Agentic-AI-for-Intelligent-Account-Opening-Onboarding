import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Eye, FileCheck, BarChart3, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: FileCheck, title: 'AI Document OCR', desc: 'Instantly extract and validate ID fields from passports, licenses, and utility bills.', color: 'var(--accent-blue)' },
  { icon: Shield, title: 'KYC Verification', desc: 'Real-time identity verification with Onfido/Jumio integration and confidence scoring.', color: 'var(--accent-purple)' },
  { icon: BarChart3, title: 'Risk Scoring', desc: 'ML-driven risk assessment with SHAP-style explainability and rule-based signals.', color: 'var(--accent-cyan)' },
  { icon: Eye, title: 'AML Screening', desc: 'Automated OFAC, EU sanctions, UN, and PEP database checks in milliseconds.', color: 'var(--accent-amber)' },
  { icon: Zap, title: 'Instant Decisions', desc: 'AI Decision Agent synthesises all signals into APPROVED / REJECTED / REVIEW.', color: 'var(--accent-green)' },
  { icon: Lock, title: 'Full Auditability', desc: 'Every agent decision written to an immutable audit log for regulatory compliance.', color: 'var(--accent-red)' },
];

const agents = [
  { name: 'DocIngestion', role: 'OCR + Field Extraction', delay: 0 },
  { name: 'KYC', role: 'Identity Verification', delay: 0.1 },
  { name: 'RiskScoring', role: 'ML Risk Assessment', delay: 0.2 },
  { name: 'AML', role: 'Sanctions Screening', delay: 0.3 },
  { name: 'Decision', role: 'Final Underwriting', delay: 0.4 },
  { name: 'Notification', role: 'Email / SMS Alert', delay: 0.5 },
];

export default function Landing() {
  return (
    <div className="page" style={{ overflowX: 'hidden' }}>
      {/* Hero */}
      <section style={{ padding: '100px 40px 80px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 999, padding: '6px 16px', fontSize: 13, color: 'var(--accent-blue)',
            fontWeight: 500, marginBottom: 28,
          }}>
            <Zap size={14} />  Production-Ready · 6 AI Agents · Full KYC/AML
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Intelligent Account<br />
            <span className="gradient-text">Opening & Onboarding</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px' }}>
            Reduce onboarding from days to minutes with autonomous AI agents handling KYC,
            document parsing, risk scoring, and AML screening — with full audit trails.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/onboarding" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Open an Account <ArrowRight size={16} />
            </Link>
            <Link to="/admin" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              View Dashboard
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Agent Pipeline Visual */}
      <section style={{ padding: '40px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          className="glass-card"
          style={{ padding: '40px', background: 'rgba(255,255,255,0.02)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 28 }}>
            AI AGENT PIPELINE
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
            {agents.map((agent, i) => (
              <React.Fragment key={agent.name}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: agent.delay + 0.4 }}
                  style={{
                    flex: '0 0 auto',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: 12, padding: '14px 20px', textAlign: 'center', minWidth: 130,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agent.role}</div>
                </motion.div>
                {i < agents.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: agent.delay + 0.55 }}
                    style={{ color: 'var(--text-muted)', fontSize: 18, flex: '0 0 auto' }}
                  >→</motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
          Everything you need
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }}>
          Built for banks, fintechs, and neobanks — configurable per institution
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card"
              style={{ padding: '28px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.5 }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${f.color}18`, border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <motion.div
          className="glass-card"
          style={{ maxWidth: 600, margin: '0 auto', padding: '60px 48px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <CheckCircle size={48} color="var(--accent-green)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ready to open your account?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
            Takes under 3 minutes. Our AI handles all verification automatically.
          </p>
          <Link to="/onboarding" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start Onboarding <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
