import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Server, Cpu, HardDrive, Wifi, Shield, Users, Globe, RefreshCw, Filter, Download } from 'lucide-react';

interface ApiMetric {
  timestamp: string;
  requests: number;
  errors: number;
  responseTime: number;
  throughput: number;
}

interface EndpointStats {
  endpoint: string;
  method: string;
  requests: number;
  errors: number;
  avgResponseTime: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface RateLimitInfo {
  endpoint: string;
  current: number;
  limit: number;
  window: string;
  status: 'normal' | 'warning' | 'exceeded';
}

export default function ApiMonitor() {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [isRealTime, setIsRealTime] = useState(true);

  // Mock data - in production, this would come from your API monitoring service
  const [metrics, setMetrics] = useState<ApiMetric[]>([
    { timestamp: '10:00', requests: 145, errors: 2, responseTime: 120, throughput: 1450 },
    { timestamp: '10:05', requests: 162, errors: 1, responseTime: 115, throughput: 1620 },
    { timestamp: '10:10', requests: 138, errors: 3, responseTime: 125, throughput: 1380 },
    { timestamp: '10:15', requests: 171, errors: 0, responseTime: 110, throughput: 1710 },
    { timestamp: '10:20', requests: 155, errors: 2, responseTime: 118, throughput: 1550 },
    { timestamp: '10:25', requests: 148, errors: 1, responseTime: 122, throughput: 1480 },
    { timestamp: '10:30', requests: 165, errors: 0, responseTime: 108, throughput: 1650 },
  ]);

  const [endpointStats] = useState<EndpointStats[]>([
    { endpoint: '/api/sessions', method: 'POST', requests: 245, errors: 3, avgResponseTime: 145, status: 'healthy' },
    { endpoint: '/api/upload', method: 'POST', requests: 189, errors: 8, avgResponseTime: 280, status: 'warning' },
    { endpoint: '/api/sessions/{id}', method: 'GET', requests: 412, errors: 1, avgResponseTime: 89, status: 'healthy' },
    { endpoint: '/api/auth/login', method: 'POST', requests: 156, errors: 2, avgResponseTime: 167, status: 'healthy' },
    { endpoint: '/api/analytics', method: 'GET', requests: 98, errors: 0, avgResponseTime: 234, status: 'healthy' },
    { endpoint: '/api/admin/bulk', method: 'POST', requests: 45, errors: 5, avgResponseTime: 450, status: 'critical' },
  ]);

  const [rateLimits] = useState<RateLimitInfo[]>([
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
    if (!isRealTime) return;

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

  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
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

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>API Monitoring Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Real-time API performance, rate limiting, and system health monitoring
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`btn-${isRealTime ? 'primary' : 'ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Activity size={16} />
            {isRealTime ? 'Live' : 'Paused'}
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input"
            style={{ fontSize: 13 }}
          >
            <option value="5m">Last 5 Minutes</option>
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <button className="btn-ghost" style={{ padding: '8px 12px' }}>
            <RefreshCw size={16} />
          </button>
          <button className="btn-ghost" style={{ padding: '8px 12px' }}>
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={20} color="var(--accent-green)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{systemHealth.uptime}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>System Uptime</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{systemHealth.activeConnections}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active Connections</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="var(--accent-amber)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                {metrics[metrics.length - 1]?.throughput || 0}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Throughput</div>
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card" whileHover={{ y: -4 }} style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="var(--accent-red)" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
                {metrics[metrics.length - 1]?.errors || 0}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Errors</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Request Volume & Response Time */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Request Volume & Response Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={12} />
              <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
              <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#f59e0b" strokeWidth={2} name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Error Rate */}
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: '24px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Error Rate & Throughput</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="timestamp" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }} />
              <Legend />
              <Area type="monotone" dataKey="errors" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Errors" />
              <Area type="monotone" dataKey="throughput" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Throughput" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* System Resources */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>System Resources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {[
            { label: 'CPU Usage', value: systemHealth.cpu, icon: Cpu, color: 'var(--accent-blue)' },
            { label: 'Memory', value: systemHealth.memory, icon: HardDrive, color: 'var(--accent-purple)' },
            { label: 'Disk Space', value: systemHealth.disk, icon: HardDrive, color: 'var(--accent-green)' },
            { label: 'Network', value: systemHealth.network, icon: Wifi, color: 'var(--accent-cyan)' },
          ].map((resource) => (
            <div key={resource.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <resource.icon size={16} color={resource.color} />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{resource.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 8, background: 'var(--glass-border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${resource.value}%`,
                      background: resource.value > 80 ? 'var(--accent-red)' : resource.value > 60 ? 'var(--accent-amber)' : resource.color,
                      borderRadius: 4,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', minWidth: 35 }}>
                  {resource.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoint Statistics */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Endpoint Performance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Endpoint</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Method</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Requests</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Errors</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Avg Response Time</th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {endpointStats.map((endpoint, index) => {
                const StatusIcon = getStatusIcon(endpoint.status);
                return (
                  <motion.tr
                    key={endpoint.endpoint}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                    whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}
                    onClick={() => setSelectedEndpoint(endpoint.endpoint)}
                  >
                    <td style={{ padding: '12px', fontSize: 13, fontFamily: 'monospace' }}>{endpoint.endpoint}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        background: endpoint.method === 'GET' ? 'var(--accent-green)15' : 'var(--accent-blue)15',
                        color: endpoint.method === 'GET' ? 'var(--accent-green)' : 'var(--accent-blue)'
                      }}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13 }}>{endpoint.requests}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13 }}>{endpoint.errors}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: 13 }}>{endpoint.avgResponseTime}ms</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <StatusIcon size={14} color={getStatusColor(endpoint.status)} />
                        <span style={{ fontSize: 12, fontWeight: 500, color: getStatusColor(endpoint.status) }}>
                          {endpoint.status}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Limiting Status */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Rate Limiting Status</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          {rateLimits.map((limit) => (
            <div key={limit.endpoint} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{limit.endpoint}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Window: {limit.window}</div>
              </div>
              <div style={{ flex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>
                    {limit.current} / {limit.limit}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    ({Math.round((limit.current / limit.limit) * 100)}%)
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--glass-border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(limit.current / limit.limit) * 100}%`,
                      background: getStatusColor(limit.status),
                      borderRadius: 3,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {(() => {
                  const StatusIcon = getStatusIcon(limit.status);
                  return <StatusIcon size={16} color={getStatusColor(limit.status)} />;
                })()}
                <span style={{ fontSize: 13, fontWeight: 500, color: getStatusColor(limit.status) }}>
                  {limit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
