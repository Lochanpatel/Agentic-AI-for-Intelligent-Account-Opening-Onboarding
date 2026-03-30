import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Download, Mail, AlertTriangle, Users, Search, RefreshCw, Trash2, Archive } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
export default function BulkOperations({ sessions }) {
    const { t } = useLanguage();
    const [selectedSessions, setSelectedSessions] = useState(new Set());
    const [bulkOperations, setBulkOperations] = useState([]);
    const [currentOperation, setCurrentOperation] = useState(null);
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
        }
        else {
            setSelectedSessions(new Set(filteredSessions.map(s => s.session_id)));
        }
    };
    const handleSelectSession = (sessionId) => {
        const newSelected = new Set(selectedSessions);
        if (newSelected.has(sessionId)) {
            newSelected.delete(sessionId);
        }
        else {
            newSelected.add(sessionId);
        }
        setSelectedSessions(newSelected);
    };
    const executeBulkOperation = async (type) => {
        if (selectedSessions.size === 0)
            return;
        const operation = {
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
            setBulkOperations(prev => prev.map(op => op.id === operation.id
                ? { ...op, progress: Math.round(((i + 1) / sessionIds.length) * 100) }
                : op));
        }
        // Complete operation
        setBulkOperations(prev => prev.map(op => op.id === operation.id
            ? { ...op, status: 'completed', progress: 100, endTime: new Date() }
            : op));
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
    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'var(--accent-green)';
            case 'REJECTED': return 'var(--accent-red)';
            case 'MANUAL_REVIEW': return 'var(--accent-amber)';
            case 'PROCESSING': return 'var(--accent-blue)';
            default: return 'var(--text-muted)';
        }
    };
    const getOperationIcon = (type) => {
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
    const getOperationLabel = (type) => {
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
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: 18, fontWeight: 600, marginBottom: 4 }, children: "Bulk Operations" }), _jsxs("p", { style: { fontSize: 13, color: 'var(--text-secondary)' }, children: [selectedSessions.size, " of ", filteredSessions.length, " sessions selected"] })] }), _jsxs("button", { onClick: () => setShowOperations(!showOperations), className: "btn-ghost", style: { padding: '8px 12px' }, children: [showOperations ? 'Hide' : 'Show', " Operations"] })] }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }, children: [_jsxs("div", { style: { position: 'relative' }, children: [_jsx(Search, { size: 16, color: "var(--text-muted)", style: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' } }), _jsx("input", { type: "text", placeholder: "Search sessions...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "form-input", style: { paddingLeft: 36, fontSize: 13, width: 200 } })] }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "form-input", style: { fontSize: 13, width: 140 }, children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "APPROVED", children: "Approved" }), _jsx("option", { value: "REJECTED", children: "Rejected" }), _jsx("option", { value: "MANUAL_REVIEW", children: "Manual Review" }), _jsx("option", { value: "PROCESSING", children: "Processing" })] }), _jsx("button", { onClick: handleSelectAll, className: "btn-ghost", style: { padding: '8px 12px', fontSize: 13 }, children: selectedSessions.size === filteredSessions.length ? 'Deselect All' : 'Select All' })] }), selectedSessions.size > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "glass-card", style: { padding: '16px', marginBottom: 20 }, children: _jsxs("div", { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }, children: [_jsx("span", { style: { fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }, children: "Bulk Actions:" }), _jsxs("button", { onClick: () => executeBulkOperation('approve'), className: "btn-primary", style: { padding: '6px 12px', fontSize: 12 }, disabled: currentOperation !== null, children: [_jsx(CheckSquare, { size: 14, style: { marginRight: 4 } }), " Approve"] }), _jsxs("button", { onClick: () => executeBulkOperation('reject'), className: "btn-secondary", style: { padding: '6px 12px', fontSize: 12, background: 'var(--accent-red)', color: 'var(--text-primary)', border: 'none' }, disabled: currentOperation !== null, children: [_jsx(AlertTriangle, { size: 14, style: { marginRight: 4 } }), " Reject"] }), _jsxs("button", { onClick: () => executeBulkOperation('email'), className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, disabled: currentOperation !== null, children: [_jsx(Mail, { size: 14, style: { marginRight: 4 } }), " Send Email"] }), _jsxs("button", { onClick: exportSelectedData, className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, children: [_jsx(Download, { size: 14, style: { marginRight: 4 } }), " Export"] }), _jsxs("button", { onClick: () => executeBulkOperation('archive'), className: "btn-ghost", style: { padding: '6px 12px', fontSize: 12 }, disabled: currentOperation !== null, children: [_jsx(Archive, { size: 14, style: { marginRight: 4 } }), " Archive"] })] }) })), currentOperation && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "glass-card", style: { padding: '16px', marginBottom: 20 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }, children: [_jsx("div", { className: "spinner", style: { width: 16, height: 16 } }), _jsxs("span", { style: { fontSize: 14, fontWeight: 500 }, children: [getOperationLabel(currentOperation.type), " in progress..."] }), _jsxs("span", { style: { fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }, children: [currentOperation.progress, "% (", currentOperation.progress, "/", currentOperation.targetCount, ")"] })] }), _jsx("div", { style: { height: 4, background: 'var(--glass-border)', borderRadius: 2 }, children: _jsx("div", { style: {
                                height: '100%',
                                background: 'var(--gradient-primary)',
                                borderRadius: 2,
                                width: `${currentOperation.progress}%`,
                                transition: 'width 0.3s'
                            } }) })] })), showOperations && bulkOperations.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "glass-card", style: { padding: '20px', marginBottom: 20 }, children: [_jsx("h4", { style: { fontSize: 14, fontWeight: 600, marginBottom: 12 }, children: "Operations History" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 8 }, children: bulkOperations.map((operation) => {
                            const Icon = getOperationIcon(operation.type);
                            return (_jsxs("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '8px 12px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 6,
                                    fontSize: 13
                                }, children: [_jsx(Icon, { size: 16, color: getStatusColor(operation.status) }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 500 }, children: getOperationLabel(operation.type) }), _jsxs("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: [operation.targetCount, " items \u2022 ", operation.status] })] }), _jsx("div", { style: { fontSize: 11, color: 'var(--text-muted)' }, children: operation.startTime && new Date(operation.startTime).toLocaleTimeString() })] }, operation.id));
                        }) })] })), _jsxs("div", { className: "glass-card", style: { padding: '0', overflow: 'hidden' }, children: [_jsx("div", { style: { padding: '16px 20px', borderBottom: '1px solid var(--glass-border)' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Users, { size: 16 }), _jsx("span", { style: { fontWeight: 500 }, children: "Select Sessions" })] }) }), _jsx("div", { style: { maxHeight: 400, overflowY: 'auto' }, children: filteredSessions.map((session) => (_jsxs("div", { style: {
                                padding: '12px 20px',
                                borderBottom: '1px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                cursor: 'pointer',
                                background: selectedSessions.has(session.session_id) ? 'var(--accent-blue)10' : 'transparent'
                            }, onClick: () => handleSelectSession(session.session_id), children: [_jsx("button", { onClick: (e) => {
                                        e.stopPropagation();
                                        handleSelectSession(session.session_id);
                                    }, style: { background: 'none', border: 'none', cursor: 'pointer' }, children: selectedSessions.has(session.session_id) ? (_jsx(CheckSquare, { size: 16, color: "var(--accent-blue)" })) : (_jsx(Square, { size: 16, color: "var(--text-muted)" })) }), _jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontWeight: 500, fontSize: 14 }, children: session.applicant_name }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: session.applicant_email })] }), _jsx("div", { style: {
                                        padding: '4px 8px',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        background: `${getStatusColor(session.status)}15`,
                                        color: getStatusColor(session.status)
                                    }, children: session.status }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: session.risk_score !== null ? `${(session.risk_score * 100).toFixed(0)}%` : '—' })] }, session.session_id))) })] })] }));
}
