"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/stat-card";
import { TopicBadge, LangBadge, ChatTypeBadge } from "@/components/topic-badge";
import { TOPIC_COLORS, TOPIC_LABELS } from "@/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Area, AreaChart,
} from "recharts";
import { format } from "date-fns";

function PageHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>{title}</h1>
      <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{sub}</p>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [convs, setConvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then(r => r.json()),
      fetch("/api/conversations?size=15").then(r => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setConvs(c.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div>
      <PageHeader title="Overview" sub="Loading dashboard data..." />
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
    </div>
  );

  // Flatten topic counts for bar chart
  const barData = (stats?.topic_chart_7d || []).map((d: any) => ({
    date: format(new Date(d.date), "MM/dd"),
    ...Object.fromEntries(Object.entries(TOPIC_LABELS).map(([k, v]) => [v, d.topic_counts?.[k] || 0])),
  }));

  const lineData = (stats?.volume_chart_30d || []).map((d: any) => ({
    date: format(new Date(d.date), "MM/dd"),
    messages: d.count,
  }));

  return (
    <div>
      <PageHeader title="Dashboard Overview" sub={`AngkorGreen ARIA · ${format(new Date(), "MMMM d, yyyy")}`} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Users" value={stats?.total_users || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          color="#2E7D32" sub="Registered users" />
        <StatCard label="Total Groups" value={stats?.total_groups || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          color="#059669" sub="Active groups" />
        <StatCard label="Total Messages" value={stats?.total_messages || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          color="#3B82F6" sub="All conversations" />
        <StatCard label="Today" value={stats?.messages_today || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
          color="#F59E0B" sub="Messages today" />
        <StatCard label="Active 24h" value={stats?.active_last_24h || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          color="#EF4444" sub="Active users" />
        <StatCard label="Group Msgs" value={stats?.group_messages || 0}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
          color="#8B5CF6" sub="In groups" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart: Topic Distribution 7 days */}
        <div className="chart-container">
          <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>Topic Distribution — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12 }} />
              {Object.entries(TOPIC_LABELS).map(([key, label]) => (
                <Bar key={key} dataKey={label} stackId="a" fill={TOPIC_COLORS[key]} radius={key === "general" ? [3,3,0,0] : [0,0,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Volume 30 days */}
        <div className="chart-container">
          <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>Message Volume — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={lineData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="messages" stroke="#2E7D32" strokeWidth={2} fill="url(#greenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold" style={{ color: "#0D1F14" }}>Recent Conversations</h3>
          <a href="/dashboard/conversations" className="text-xs font-semibold" style={{ color: "#2E7D32" }}>View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Time</th>
                <th>Message</th>
                <th>Topic</th>
                <th>Type</th>
                <th>Lang</th>
              </tr>
            </thead>
            <tbody>
              {convs.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8" style={{ color: "#9CA3AF" }}>No conversations yet</td></tr>
              ) : convs.map((c: any) => (
                <tr key={c.id}>
                  <td className="font-mono text-xs">{c.user_id?.substring(0, 8)}...</td>
                  <td className="text-xs whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                    {c.timestamp ? format(new Date(c.timestamp), "MM/dd HH:mm") : "—"}
                  </td>
                  <td>
                    <span className="text-xs" style={{ color: "#374151" }}>
                      {c.user_message?.substring(0, 60)}{c.user_message?.length > 60 ? "..." : ""}
                    </span>
                  </td>
                  <td><TopicBadge topic={c.detected_topic} /></td>
                  <td><ChatTypeBadge type={c.chat_type} /></td>
                  <td><LangBadge lang={c.language_used} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
