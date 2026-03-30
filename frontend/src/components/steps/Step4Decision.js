import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useOnboardingStore } from '../../store/onboardingStore';
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
const DECISION_CONFIG = {
    APPROVED: {
        icon: CheckCircle, color: 'var(--accent-green)', glow: 'glow-green',
        bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)',
        title: 'Application Approved! 🎉',
        subtitle: 'Welcome aboard! Your account is being set up.',
        badge: 'badge-approved', badgeLabel: 'APPROVED',
    },
    REJECTED: {
        icon: XCircle, color: 'var(--accent-red)', glow: 'glow-red',
        bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',
        title: 'Application Not Approved',
        subtitle: 'We could not approve your application at this time.',
        badge: 'badge-rejected', badgeLabel: 'REJECTED',
    },
    MANUAL_REVIEW: {
        icon: Clock, color: 'var(--accent-amber)', glow: 'glow-amber',
        bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)',
        title: 'Under Review',
        subtitle: 'A compliance officer will review your application within 2 business days.',
        badge: 'badge-review', badgeLabel: 'MANUAL REVIEW',
    },
    FAILED: {
        icon: AlertTriangle, color: 'var(--accent-red)', glow: 'glow-red',
        bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)',
        title: 'Processing Error',
        subtitle: 'Something went wrong. Please try again.',
        badge: 'badge-rejected', badgeLabel: 'FAILED',
    },
};
export default function Step4Decision() {
    const { session, applicant, reset } = useOnboardingStore();
    const status = (session?.status || 'MANUAL_REVIEW');
    const cfg = DECISION_CONFIG[status] || DECISION_CONFIG.MANUAL_REVIEW;
    const Icon = cfg.icon;
    const triggeredRules = session?.triggered_rules || [];
    const riskScore = session?.risk_score;
    return (_jsx(motion.div, { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4 }, children: _jsxs("div", { className: `glass-card ${cfg.glow}`, style: {
                padding: '48px 40px', textAlign: 'center',
                background: cfg.bg, borderColor: cfg.border,
            }, children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { type: 'spring', delay: 0.2, stiffness: 200 }, children: _jsx(Icon, { size: 64, color: cfg.color, style: { marginBottom: 20 } }) }), _jsx("span", { className: `badge ${cfg.badge}`, style: { marginBottom: 16, fontSize: 13, padding: '6px 14px' }, children: cfg.badgeLabel }), _jsx("h2", { style: { fontSize: 26, fontWeight: 700, marginBottom: 10 }, children: cfg.title }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }, children: cfg.subtitle }), session?.decision_reasoning && (_jsxs("div", { style: {
                        background: 'var(--glass-border)', border: '1px solid var(--glass-border)',
                        borderRadius: 12, padding: '20px 24px', marginBottom: 24, textAlign: 'left',
                    }, children: [_jsx("div", { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 8 }, children: "\uD83E\uDD16 AI REASONING" }), _jsx("p", { style: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }, children: session.decision_reasoning })] })), riskScore !== undefined && (_jsxs("div", { style: {
                        display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 24,
                        padding: '16px', background: 'var(--glass-border)', borderRadius: 10,
                    }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.05em' }, children: "RISK SCORE" }), _jsxs("div", { style: { fontSize: 24, fontWeight: 700, color: cfg.color }, children: [(riskScore * 100).toFixed(1), "%"] })] }), applicant?.first_name && (_jsxs("div", { children: [_jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.05em' }, children: "APPLICANT" }), _jsxs("div", { style: { fontSize: 16, fontWeight: 600 }, children: [applicant.first_name, " ", applicant.last_name] })] }))] })), triggeredRules.length > 0 && (_jsxs("div", { style: { marginBottom: 24, textAlign: 'left' }, children: [_jsx("div", { style: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 10 }, children: "TRIGGERED SIGNALS" }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 8 }, children: triggeredRules.map(rule => (_jsx("span", { style: {
                                    padding: '4px 10px', background: 'rgba(245,158,11,0.1)',
                                    border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6,
                                    fontSize: 12, color: 'var(--accent-amber)',
                                }, children: rule.replace(/_/g, ' ') }, rule))) })] })), _jsxs("div", { style: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }, children: [_jsxs("button", { className: "btn-secondary", onClick: reset, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(RefreshCw, { size: 15 }), " New Application"] }), _jsxs(Link, { to: "/admin", className: "btn-primary", style: { display: 'inline-flex', alignItems: 'center', gap: 8 }, children: [_jsx(Eye, { size: 15 }), " View Dashboard"] })] })] }) }));
}
