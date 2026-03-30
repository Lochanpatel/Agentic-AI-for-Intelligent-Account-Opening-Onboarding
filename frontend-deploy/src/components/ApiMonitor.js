import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, Server, Cpu, HardDrive, Wifi, Users, RefreshCw, Download } from 'lucide-react';
export default function ApiMonitor() {
    const [timeRange, setTimeRange] = useState('1h');
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [isRealTime, setIsRealTime] = useState(true);
    // Mock data - in production, this would come from your API monitoring service
    const [metrics, setMetrics] = useState([
        { timestamp: '10:00', requests: 145, errors: 2, responseTime: 120, throughput: 1450 },
        { timestamp: '10:05', requests: 162, errors: 1, responseTime: 115, throughput: 1620 },
        { timestamp: '10:10', requests: 138, errors: 3, responseTime: 125, throughput: 1380 },
        { timestamp: '10:15', requests: 171, errors: 0, responseTime: 110, throughput: 1710 },
        { timestamp: '10:20', requests: 155, errors: 2, responseTime: 118, throughput: 1550 },
        { timestamp: '10:25', requests: 148, errors: 1, responseTime: 122, throughput: 1480 },
        { timestamp: '10:30', requests: 165, errors: 0, responseTime: 108, throughput: 1650 },
    ]);
    const [endpointStats] = useState([
        { endpoint: '/api/sessions', method: 'POST', requests: 245, errors: 3, avgResponseTime: 145, status: 'healthy' },
        { endpoint: '/api/upload', method: 'POST', requests: 189, errors: 8, avgResponseTime: 280, status: 'warning' },
        { endpoint: '/api/sessions/{id}', method: 'GET', requests: 412, errors: 1, avgResponseTime: 89, status: 'healthy' },
        { endpoint: '/api/auth/login', method: 'POST', requests: 156, errors: 2, avgResponseTime: 167, status: 'healthy' },
        { endpoint: '/api/analytics', method: 'GET', requests: 98, errors: 0, avgResponseTime: 234, status: 'healthy' },
        { endpoint: '/api/admin/bulk', method: 'POST', requests: 45, errors: 5, avgResponseTime: 450, status: 'critical' },
    ]);
    const [rateLimits] = useState([
        { endpoint: '/api/sessions', current: 145, limit: 1000, window: '1h', status: 'normal' },
        { endpoint: '/api/upload', current: 89, limit: 100, window: '1h', status: 'warning' },
        { endpoint: '/api/auth/login', current: 67, limit: 200, window: '1h', status: 'normal' },
        { endpoint: '/api/analytics', current: 23, limit: 500, window: '1h', status: 'normal' },
    ]);
    const [systemHealth] = useState({
        cpu: 45,
        memory: 62,
        disk: 38,
        network: 78,
        uptime: '15d 7h 23m',
        activeConnections: 1247,
    });
    useEffect(() => {
        if (!isRealTime)
            return;
        const interval = setInterval(() => {
            // Simulate real-time updates
            setMetrics(prev => {
                const newMetric = {
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    requests: Math.floor(Math.random() * 50) + 130,
                    errors: Math.floor(Math.random() * 5),
                    responseTime: Math.floor(Math.random() * 30) + 100,
                    throughput: Math.floor(Math.random() * 500) + 1300,
                };
                return [...prev.slice(-6), newMetric];
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [isRealTime]);
    const getStatusColor = (status) => {
        switch (status) {
            case 'healthy':
            case 'normal':
                return 'var(--accent-green)';
            case 'warning':
                return 'var(--accent-amber)';
            case 'critical':
            case 'exceeded':
                return 'var(--accent-red)';
            default:
                return 'var(--text-muted)';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'healthy':
            case 'normal':
                return CheckCircle;
            case 'warning':
                return AlertTriangle;
            case 'critical':
            case 'exceeded':
                return XCircle;
            default:
                return Activity;
        }
    };
    const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
    return (_jsxs("div", { style: { padding: '20px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: 24, fontWeight: 700, marginBottom: 8 }, children: "API Monitoring Dashboard" }), _jsx("p", { style: { color: 'var(--text-secondary)', fontSize: 14 }, children: "Real-time API performance, rate limiting, and system health monitoring" })] }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsxs("button", { onClick: () => setIsRealTime(!isRealTime), className: `btn-${isRealTime ? 'primary' : 'ghost'}`, style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx(Activity, { size: 16 }), isRealTime ? 'Live' : 'Paused'] }), _jsxs("select", { value: timeRange, onChange: (e) => setTimeRange(e.target.value), className: "form-input", style: { fontSize: 13 }, children: [_jsx("option", { value: "5m", children: "Last 5 Minutes" }), _jsx("option", { value: "1h", children: "Last Hour" }), _jsx("option", { value: "24h", children: "Last 24 Hours" }), _jsx("option", { value: "7d", children: "Last 7 Days" })] }), _jsx("button", { className: "btn-ghost", style: { padding: '8px 12px' }, children: _jsx(RefreshCw, { size: 16 }) }), _jsx("button", { className: "btn-ghost", style: { padding: '8px 12px' }, children: _jsx(Download, { size: 16 }) })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }, children: [_jsx(motion.div, { className: "glass-card", whileHover: { y: -4 }, style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Server, { size: 20, color: "var(--accent-green)" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }, children: systemHealth.uptime }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-secondary)' }, children: "System Uptime" })] })] }) }), _jsx(motion.div, { className: "glass-card", whileHover: { y: -4 }, style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(Users, { size: 20, color: "var(--accent-blue)" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }, children: systemHealth.activeConnections }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-secondary)' }, children: "Active Connections" })] })] }) }), _jsx(motion.div, { className: "glass-card", whileHover: { y: -4 }, style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(TrendingUp, { size: 20, color: "var(--accent-amber)" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }, children: metrics[metrics.length - 1]?.throughput || 0 }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-secondary)' }, children: "Current Throughput" })] })] }) }), _jsx(motion.div, { className: "glass-card", whileHover: { y: -4 }, style: { padding: '20px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }, children: [_jsx("div", { style: { width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }, children: _jsx(AlertTriangle, { size: 20, color: "var(--accent-red)" }) }), _jsxs("div", { children: [_jsx("div", { style: { fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }, children: metrics[metrics.length - 1]?.errors || 0 }), _jsx("div", { style: { fontSize: 12, color: 'var(--text-secondary)' }, children: "Current Errors" })] })] }) })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 24 }, children: [_jsxs(motion.div, { className: "glass-card", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, style: { padding: '24px' }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 20 }, children: "Request Volume & Response Time" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(LineChart, { data: metrics, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--glass-border)" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "var(--text-muted)", fontSize: 12 }), _jsx(YAxis, { yAxisId: "left", stroke: "var(--text-muted)", fontSize: 12 }), _jsx(YAxis, { yAxisId: "right", orientation: "right", stroke: "var(--text-muted)", fontSize: 12 }), _jsx(Tooltip, { contentStyle: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 } }), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "requests", stroke: "#3b82f6", strokeWidth: 2, name: "Requests" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "responseTime", stroke: "#f59e0b", strokeWidth: 2, name: "Response Time (ms)" })] }) })] }), _jsxs(motion.div, { className: "glass-card", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, style: { padding: '24px' }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 20 }, children: "Error Rate & Throughput" }), _jsx(ResponsiveContainer, { width: "100%", height: 250, children: _jsxs(AreaChart, { data: metrics, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--glass-border)" }), _jsx(XAxis, { dataKey: "timestamp", stroke: "var(--text-muted)", fontSize: 12 }), _jsx(YAxis, { stroke: "var(--text-muted)", fontSize: 12 }), _jsx(Tooltip, { contentStyle: { backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 } }), _jsx(Legend, {}), _jsx(Area, { type: "monotone", dataKey: "errors", stackId: "1", stroke: "#ef4444", fill: "#ef4444", fillOpacity: 0.6, name: "Errors" }), _jsx(Area, { type: "monotone", dataKey: "throughput", stackId: "2", stroke: "#10b981", fill: "#10b981", fillOpacity: 0.6, name: "Throughput" })] }) })] })] }), _jsxs("div", { className: "glass-card", style: { padding: '24px', marginBottom: 24 }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 20 }, children: "System Resources" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }, children: [
                            { label: 'CPU Usage', value: systemHealth.cpu, icon: Cpu, color: 'var(--accent-blue)' },
                            { label: 'Memory', value: systemHealth.memory, icon: HardDrive, color: 'var(--accent-purple)' },
                            { label: 'Disk Space', value: systemHealth.disk, icon: HardDrive, color: 'var(--accent-green)' },
                            { label: 'Network', value: systemHealth.network, icon: Wifi, color: 'var(--accent-cyan)' },
                        ].map((resource) => (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }, children: [_jsx(resource.icon, { size: 16, color: resource.color }), _jsx("span", { style: { fontSize: 14, fontWeight: 500 }, children: resource.label })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8 }, children: [_jsx("div", { style: { flex: 1, height: 8, background: 'var(--glass-border)', borderRadius: 4, overflow: 'hidden' }, children: _jsx("div", { style: {
                                                    height: '100%',
                                                    width: `${resource.value}%`,
                                                    background: resource.value > 80 ? 'var(--accent-red)' : resource.value > 60 ? 'var(--accent-amber)' : resource.color,
                                                    borderRadius: 4,
                                                    transition: 'width 0.3s ease'
                                                } }) }), _jsxs("span", { style: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', minWidth: 35 }, children: [resource.value, "%"] })] })] }, resource.label))) })] }), _jsxs("div", { className: "glass-card", style: { padding: '24px', marginBottom: 24 }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 20 }, children: "Endpoint Performance" }), _jsx("div", { style: { overflowX: 'auto' }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '1px solid var(--glass-border)' }, children: [_jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Endpoint" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Method" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Requests" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Errors" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Avg Response Time" }), _jsx("th", { style: { padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }, children: "Status" })] }) }), _jsx("tbody", { children: endpointStats.map((endpoint, index) => {
                                        const StatusIcon = getStatusIcon(endpoint.status);
                                        return (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, style: { borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }, whileHover: { backgroundColor: 'var(--bg-card-hover)' }, onClick: () => setSelectedEndpoint(endpoint.endpoint), children: [_jsx("td", { style: { padding: '12px', fontSize: 13, fontFamily: 'monospace' }, children: endpoint.endpoint }), _jsx("td", { style: { padding: '12px' }, children: _jsx("span", { style: {
                                                            padding: '4px 8px',
                                                            borderRadius: 4,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            background: endpoint.method === 'GET' ? 'var(--accent-green)15' : 'var(--accent-blue)15',
                                                            color: endpoint.method === 'GET' ? 'var(--accent-green)' : 'var(--accent-blue)'
                                                        }, children: endpoint.method }) }), _jsx("td", { style: { padding: '12px', textAlign: 'center', fontSize: 13 }, children: endpoint.requests }), _jsx("td", { style: { padding: '12px', textAlign: 'center', fontSize: 13 }, children: endpoint.errors }), _jsxs("td", { style: { padding: '12px', textAlign: 'center', fontSize: 13 }, children: [endpoint.avgResponseTime, "ms"] }), _jsx("td", { style: { padding: '12px', textAlign: 'center' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }, children: [_jsx(StatusIcon, { size: 14, color: getStatusColor(endpoint.status) }), _jsx("span", { style: { fontSize: 12, fontWeight: 500, color: getStatusColor(endpoint.status) }, children: endpoint.status })] }) })] }, endpoint.endpoint));
                                    }) })] }) })] }), _jsxs("div", { className: "glass-card", style: { padding: '24px' }, children: [_jsx("h3", { style: { fontSize: 16, fontWeight: 600, marginBottom: 20 }, children: "Rate Limiting Status" }), _jsx("div", { style: { display: 'grid', gap: 16 }, children: rateLimits.map((limit) => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 8 }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsx("div", { style: { fontSize: 14, fontWeight: 500, marginBottom: 4 }, children: limit.endpoint }), _jsxs("div", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: ["Window: ", limit.window] })] }), _jsxs("div", { style: { flex: 2 }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }, children: [_jsxs("span", { style: { fontSize: 13, fontWeight: 500 }, children: [limit.current, " / ", limit.limit] }), _jsxs("span", { style: { fontSize: 12, color: 'var(--text-muted)' }, children: ["(", Math.round((limit.current / limit.limit) * 100), "%)"] })] }), _jsx("div", { style: { height: 6, background: 'var(--glass-border)', borderRadius: 3, overflow: 'hidden' }, children: _jsx("div", { style: {
                                                    height: '100%',
                                                    width: `${(limit.current / limit.limit) * 100}%`,
                                                    background: getStatusColor(limit.status),
                                                    borderRadius: 3,
                                                    transition: 'width 0.3s ease'
                                                } }) })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 6 }, children: [(() => {
                                            const StatusIcon = getStatusIcon(limit.status);
                                            return _jsx(StatusIcon, { size: 16, color: getStatusColor(limit.status) });
                                        })(), _jsx("span", { style: { fontSize: 13, fontWeight: 500, color: getStatusColor(limit.status) }, children: limit.status })] })] }, limit.endpoint))) })] })] }));
}
