import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useOnboardingStore } from '../../store/onboardingStore';
import { getSession } from '../../api/client';
import { CheckCircle, XCircle, Clock, Loader, SkipForward } from 'lucide-react';
const AGENT_LABELS = {
    doc_ingestion: 'Document OCR & Extraction',
    kyc_check: 'KYC Identity Verification',
    risk_scoring: 'Risk Assessment',
    aml_screen: 'AML & Sanctions Screening',
    decision: 'AI Decision Engine',
    notification: 'Notification Sent',
};
const TERMINAL_STATUSES = ['APPROVED', 'REJECTED', 'MANUAL_REVIEW', 'FAILED'];
function AgentRow({ agentId, result }) {
    const status = result?.status || 'pending';
    const icon = {
        completed: _jsx(CheckCircle, { size: 16, color: "var(--accent-green)" }),
        failed: _jsx(XCircle, { size: 16, color: "var(--accent-red)" }),
        skipped: _jsx(SkipForward, { size: 16, color: "var(--text-muted)" }),
        running: _jsx(Loader, { size: 16, color: "var(--accent-blue)", style: { animation: 'spin 1s linear infinite' } }),
        pending: _jsx(Clock, { size: 16, color: "var(--text-muted)" }),
    }[status] || _jsx(Clock, { size: 16, color: "var(--text-muted)" });
    const colors = {
        completed: 'var(--accent-green)', failed: 'var(--accent-red)',
        running: 'var(--accent-blue)', skipped: 'var(--text-muted)', pending: 'var(--text-muted)',
    };
    return (_jsxs("div", { style: {
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
            background: status === 'running' ? 'rgba(59,130,246,0.05)' : 'transparent',
            borderRadius: 10, transition: 'background 0.2s',
            borderLeft: `3px solid ${status !== 'pending' ? colors[status] : 'transparent'}`,
        }, children: [icon, _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontSize: 14, fontWeight: 500, color: status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }, children: AGENT_LABELS[agentId] || agentId }), result?.result?.reasoning && (_jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }, children: result.result.reasoning })), result?.error && _jsx("div", { style: { fontSize: 12, color: 'var(--accent-red)', marginTop: 2 }, children: result.error })] }), result?.result?.risk_score !== undefined && (_jsxs("span", { style: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }, children: ["Risk: ", (result.result.risk_score * 100).toFixed(0), "%"] })), result?.result?.confidence_score !== undefined && (_jsxs("span", { style: { fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }, children: ["KYC: ", (result.result.confidence_score * 100).toFixed(0), "%"] })), _jsx("span", { style: { fontSize: 11, fontWeight: 600, color: colors[status], textTransform: 'uppercase', letterSpacing: '0.05em' }, children: status })] }));
}
export default function Step3Processing() {
    const { sessionId, setSession, setStep, session } = useOnboardingStore();
    useEffect(() => {
        let interval;
        const poll = async () => {
            if (!sessionId)
                return;
            try {
                const res = await getSession(sessionId);
                setSession(res.data);
                if (TERMINAL_STATUSES.includes(res.data.status)) {
                    clearInterval(interval);
                    console.log('Processing complete, moving to decision step. Status:', res.data.status);
                    setTimeout(() => setStep(6), 1000); // Go to decision step (6), not video step (4)
                }
            }
            catch { }
        };
        poll();
        interval = setInterval(poll, 1500);
        return () => clearInterval(interval);
    }, [sessionId]);
    const agentOrder = ['doc_ingestion', 'kyc_check', 'risk_scoring', 'aml_screen', 'decision', 'notification'];
    const agentResults = session?.agent_results || {};
    const isProcessing = session?.status === 'PROCESSING';
    return (_jsxs("div", { className: "glass-card", style: { padding: '40px' }, children: [_jsx("div", { style: { textAlign: 'center', marginBottom: 32 }, children: isProcessing ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "spinner", style: { margin: '0 auto 20px' } }), _jsx("h2", { style: { fontSize: 22, fontWeight: 700, marginBottom: 8 }, children: "AI Agents Working" }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: 14 }, children: "Verifying your identity and assessing risk in real time..." })] })) : (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 48, color: "var(--accent-green)", style: { marginBottom: 16 } }), _jsx("h2", { style: { fontSize: 22, fontWeight: 700, marginBottom: 8 }, children: "Analysis Complete" }), _jsx("p", { style: { color: 'var(--text-muted)', fontSize: 14 }, children: "Redirecting to your decision..." })] })) }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 4 }, children: agentOrder.map(id => (_jsx(AgentRow, { agentId: id, result: agentResults[id] }, id))) }), session?.risk_score !== undefined && (_jsxs("div", { style: { marginTop: 24, padding: '16px 20px', background: 'var(--glass-border)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { style: { fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }, children: "Overall Risk Score" }), _jsxs("span", { style: {
                            fontSize: 20, fontWeight: 700,
                            color: session.risk_score > 0.7 ? 'var(--accent-red)' : session.risk_score > 0.4 ? 'var(--accent-amber)' : 'var(--accent-green)'
                        }, children: [(session.risk_score * 100).toFixed(1), "%"] })] }))] }));
}
