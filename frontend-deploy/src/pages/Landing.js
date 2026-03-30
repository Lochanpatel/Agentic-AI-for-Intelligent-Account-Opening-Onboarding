import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Eye, FileCheck, BarChart3, Lock, ArrowRight, CheckCircle, Play, Users, TrendingUp, Clock, Star } from 'lucide-react';
const features = [
    { icon: FileCheck, title: 'AI Document OCR', desc: 'Instantly extract and validate ID fields from passports, licenses, and utility bills with 99.8% accuracy.', color: 'var(--accent-blue)', stat: '99.8%' },
    { icon: Shield, title: 'KYC Verification', desc: 'Real-time identity verification with Onfido/Jumio integration and confidence scoring.', color: 'var(--accent-purple)', stat: '< 2min' },
    { icon: BarChart3, title: 'Risk Scoring', desc: 'ML-driven risk assessment with SHAP-style explainability and rule-based signals.', color: 'var(--accent-cyan)', stat: 'AI-Powered' },
    { icon: Eye, title: 'AML Screening', desc: 'Automated OFAC, EU sanctions, UN, and PEP database checks in milliseconds.', color: 'var(--accent-amber)', stat: '200+ DBs' },
    { icon: Zap, title: 'Instant Decisions', desc: 'AI Decision Agent synthesises all signals into APPROVED / REJECTED / REVIEW.', color: 'var(--accent-green)', stat: '< 30sec' },
    { icon: Lock, title: 'Full Auditability', desc: 'Every agent decision written to an immutable audit log for regulatory compliance.', color: 'var(--accent-red)', stat: 'GDPR-Ready' },
];
const stats = [
    { label: 'Accounts Opened', value: '10K+', icon: Users },
    { label: 'Success Rate', value: '94%', icon: TrendingUp },
    { label: 'Avg Time', value: '2.3m', icon: Clock },
    { label: 'Customer Rating', value: '4.9★', icon: Star },
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
    const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAgentIndex((prev) => (prev + 1) % agents.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (_jsxs("div", { className: "page", style: { overflowX: 'hidden' }, children: [_jsxs("section", { style: { padding: '100px 40px 80px', maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }, children: [_jsx("div", { className: "glow-orb", style: { top: '10%', left: '20%', background: 'var(--accent-blue)', opacity: 0.1 } }), _jsx("div", { className: "glow-orb", style: { bottom: '20%', right: '15%', background: 'var(--accent-purple)', opacity: 0.1 } }), _jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: 'easeOut' }, children: [_jsxs("div", { style: {
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                                    borderRadius: 999, padding: '6px 16px', fontSize: 13, color: 'var(--accent-blue)',
                                    fontWeight: 500, marginBottom: 28,
                                }, children: [_jsx("div", { className: "status-indicator processing" }), "Production-Ready \u00B7 6 AI Agents \u00B7 Full KYC/AML"] }), _jsxs("h1", { style: { fontSize: 'clamp(40px, 6vw, 76px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 }, children: ["Intelligent Account", _jsx("br", {}), _jsx("span", { className: "gradient-text", children: "Opening & Onboarding" })] }), _jsx("p", { style: { fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 620, margin: '0 auto 40px' }, children: "Reduce onboarding from days to minutes with autonomous AI agents handling KYC, document parsing, risk scoring, and AML screening \u2014 with full audit trails." }), _jsxs("div", { style: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }, children: [_jsxs(Link, { to: "/onboarding", className: "btn-primary", style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px' }, children: ["Open an Account ", _jsx(ArrowRight, { size: 16 })] }), _jsxs("button", { onClick: () => setIsPlaying(!isPlaying), className: "btn-ghost", style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px' }, children: [_jsx(Play, { size: 16 }), " ", isPlaying ? 'Pause' : 'Watch', " Demo"] })] })] }), _jsx(motion.div, { className: "glass-card", style: { padding: '24px', marginTop: 40 }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 32 }, children: stats.map((stat, i) => (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.1 * i + 0.4 }, style: { textAlign: 'center' }, children: [_jsx(stat.icon, { size: 20, color: "var(--accent-blue)", style: { marginBottom: 8 } }), _jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: stat.value }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }, children: stat.label })] }, stat.label))) }) })] }), _jsx("section", { style: { padding: '40px', maxWidth: 1100, margin: '0 auto' }, children: _jsxs(motion.div, { className: "glass-card", style: { padding: '40px' }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, children: [_jsx("p", { style: { textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 28 }, children: "AI AGENT PIPELINE" }), _jsx("div", { style: { textAlign: 'center', marginBottom: 32 }, children: _jsx(AnimatePresence, { mode: "wait", children: _jsxs(motion.div, { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -50 }, transition: { duration: 0.5 }, className: "metric-card", style: {
                                        display: 'inline-block',
                                        padding: '20px 30px',
                                        minWidth: 250,
                                        background: 'linear-gradient(135deg, rgba(99,91,255,0.1) 0%, rgba(0,212,255,0.1) 100%)',
                                        border: '1px solid rgba(99,91,255,0.2)'
                                    }, children: [_jsx("div", { style: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }, children: agents[currentAgentIndex].name }), _jsx("div", { style: { fontSize: 14, color: 'var(--text-secondary)' }, children: agents[currentAgentIndex].role })] }, currentAgentIndex) }) }), _jsx("div", { style: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }, children: agents.map((_, i) => (_jsx("button", { onClick: () => setCurrentAgentIndex(i), style: {
                                    width: 8, height: 8,
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: i === currentAgentIndex ? 'var(--accent-blue)' : 'var(--glass-border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                } }, i))) }), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 8 }, children: agents.map((agent, i) => (_jsxs(React.Fragment, { children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: {
                                            opacity: 1,
                                            scale: 1,
                                            background: i <= currentAgentIndex ? 'rgba(99,91,255,0.15)' : 'rgba(59,130,246,0.08)',
                                            borderColor: i <= currentAgentIndex ? 'rgba(99,91,255,0.3)' : 'rgba(59,130,246,0.2)'
                                        }, transition: { delay: agent.delay + 0.4 }, style: {
                                            flex: '0 0 auto',
                                            border: '1px solid',
                                            borderRadius: 12, padding: '14px 20px', textAlign: 'center', minWidth: 130,
                                            transition: 'all 0.3s ease'
                                        }, children: [_jsx("div", { style: { fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }, children: agent.name }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: agent.role })] }), i < agents.length - 1 && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: i < currentAgentIndex ? 1 : 0.3 }, transition: { delay: agent.delay + 0.55 }, style: { color: 'var(--text-muted)', fontSize: 18, flex: '0 0 auto' }, children: "\u2192" }))] }, agent.name))) })] }) }), _jsxs("section", { style: { padding: '60px 40px', maxWidth: 1100, margin: '0 auto' }, children: [_jsx("h2", { style: { textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 12 }, children: "Everything you need" }), _jsx("p", { style: { textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48 }, children: "Built for banks, fintechs, and neobanks \u2014 configurable per institution" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }, children: features.map((f, i) => (_jsxs(motion.div, { className: "metric-card", style: { padding: '32px', position: 'relative' }, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 * i + 0.5 }, whileHover: { y: -4 }, children: [f.stat && (_jsx("div", { style: {
                                        position: 'absolute',
                                        top: 16, right: 16,
                                        background: `${f.color}15`,
                                        color: f.color,
                                        padding: '4px 12px',
                                        borderRadius: 999,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: '0.05em'
                                    }, children: f.stat })), _jsx("div", { style: {
                                        width: 48, height: 48, borderRadius: 12,
                                        background: `${f.color}18`, border: `1px solid ${f.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
                                    }, children: _jsx(f.icon, { size: 24, color: f.color }) }), _jsx("h3", { style: { fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }, children: f.title }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }, children: f.desc })] }, f.title))) })] }), _jsxs("section", { style: { padding: '80px 40px', textAlign: 'center', position: 'relative' }, children: [_jsx("div", { className: "glow-orb", style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--accent-green)', opacity: 0.05 } }), _jsxs(motion.div, { className: "glass-card", style: { maxWidth: 600, margin: '0 auto', padding: '60px 48px', position: 'relative', zIndex: 1 }, initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.8 }, children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.9, type: 'spring', stiffness: 200 }, style: {
                                    width: 64, height: 64,
                                    borderRadius: '50%',
                                    background: 'var(--gradient-success)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 24px'
                                }, children: _jsx(CheckCircle, { size: 32, color: "var(--text-primary)" }) }), _jsx("h2", { style: { fontSize: 32, fontWeight: 700, marginBottom: 16 }, children: "Ready to open your account?" }), _jsx("p", { style: { color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6, fontSize: 16 }, children: "Takes under 3 minutes. Our AI handles all verification automatically." }), _jsxs("div", { style: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsxs(Link, { to: "/onboarding", className: "btn-success", style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px' }, children: ["Start Onboarding ", _jsx(ArrowRight, { size: 16 })] }), _jsx(Link, { to: "/admin", className: "btn-ghost", style: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px' }, children: "View Dashboard" })] })] })] })] }));
}
