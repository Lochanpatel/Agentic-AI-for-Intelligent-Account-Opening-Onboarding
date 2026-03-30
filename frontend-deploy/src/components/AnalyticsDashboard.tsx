import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, CheckCircle, XCircle, AlertTriangle, Activity, Calendar, Filter, Download } from 'lucide-react';

interface AnalyticsData {
  dailyStats: Array<{ date: string; applications: number; approved: number; rejected: number; review: number }>;
  riskDistribution: Array<{ range: string; count: number; percentage: number }>;
  processingTimes: Array<{ agent: string; avgTime: number; target: number }>;
  conversionFunnel: Array<{ step: string; users: number; dropoff: number }>;
  institutionMetrics: Array<{ name: string; applications: number; approvalRate: number; avgRisk: number }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulated data - in production, this would come from your API
    const mockData: AnalyticsData = {
      dailyStats: [
        { date: 'Mon', applications: 45, approved: 32, rejected: 8, review: 5 },
        { date: 'Tue', applications: 52, approved: 38, rejected: 9, review: 5 },
        { date: 'Wed', applications: 48, approved: 35, rejected: 7, review: 6 },
        { date: 'Thu', applications: 61, approved: 44, rejected: 10, review: 7 },
        { date: 'Fri', applications: 58, approved: 42, rejected: 9, review: 7 },
        { date: 'Sat', applications: 33, approved: 24, rejected: 5, review: 4 },
        { date: 'Sun', applications: 28, approved: 21, rejected: 4, review: 3 },
      ],
      riskDistribution: [
        { range: 'Low (0-30%)', count: 145, percentage: 58 },
        { range: 'Medium (31-70%)', count: 78, percentage: 31 },
        { range: 'High (71-100%)', count: 27, percentage: 11 },
      ],
      processingTimes: [
        { agent: 'DocIngestion', avgTime: 12, target: 15 },
        { agent: 'KYC', avgTime: 45, target: 60 },
        { agent: 'RiskScoring', avgTime: 8, target: 10 },
        { agent: 'AML', avgTime: 3, target: 5 },
        { agent: 'Decision', avgTime: 15, target: 20 },
      ],
      conversionFunnel: [
        { step: 'Started', users: 325, dropoff: 0 },
        { step: 'Personal Info', users: 298, dropoff: 8 },
        { step: 'Financials', users: 276, dropoff: 7 },
        { step: 'Documents', users: 251, dropoff: 9 },
        { step: 'Processing', users: 238, dropoff: 5 },
        { step: 'Decision', users: 236, dropoff: 1 },
      ],
      institutionMetrics: [
        { name: 'Bank A', applications: 145, approvalRate: 89, avgRisk: 0.32 },
        { name: 'FinTech B', applications: 98, approvalRate: 76, avgRisk: 0.45 },
        { name: 'NeoBank C', applications: 67, approvalRate: 92, avgRisk: 0.28 },
        { name: 'Credit Union D', applications: 40, approvalRate: 85, avgRisk: 0.38 },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
    <motion.div 
      className="metric-card"
      whileHover={{ y: -4 }}
      style={{ padding: '24px', position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: color, filter: 'blur(40px)', opacity: 0.15, borderRadius: '50%' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}15`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={22} color={color} />
        </div>
        {change && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: change > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
            {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 40, height: 40, margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-muted)' }}>Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Advanced Analytics</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Real-time insights and performance metrics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input"
            style={{ fontSize: 13 }}
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn-ghost" style={{ padding: '8px 12px' }}>
            <Filter size={16} />
          </button>
          <button className="btn-ghost" style={{ padding: '8px 12px' }}>
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
        <MetricCard title="Total Applications" value={data?.dailyStats.reduce((sum, day) => sum + day.applications, 0)} change={12} icon={Users} color="var(--accent-blue)" />
        <MetricCard title="Approval Rate" value="87%" change={3} icon={CheckCircle} color="var(--accent-green)" />
        <MetricCard title="Avg Processing Time" value="2.3m" change={-8} icon={Clock} color="var(--accent-amber)" />
        <MetricCard title="Risk Score Average" value="0.34" change={-5} icon={AlertTriangle} color="var(--accent-purple)" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Application Trends */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="var(--accent-blue)" />
            Application Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data?.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Area type="monotone" dataKey="applications" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="approved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Area type="monotone" dataKey="rejected" stackId="3" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              <Area type="monotone" dataKey="review" stackId="4" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="var(--accent-purple)" />
            Risk Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data?.riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {data?.riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Processing Times & Conversion Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* Agent Processing Times */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} color="var(--accent-cyan)" />
            Agent Processing Times
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.processingTimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis dataKey="agent" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="avgTime" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div 
          className="glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ padding: '24px' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--accent-green)" />
            Conversion Funnel
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data?.conversionFunnel} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={12} />
              <YAxis dataKey="step" type="category" stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="users" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Institution Performance */}
      <motion.div 
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ padding: '24px' }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} color="var(--accent-blue)" />
          Institution Performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data?.institutionMetrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
            <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={12} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="approvalRate" stroke="#10b981" strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="avgRisk" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
