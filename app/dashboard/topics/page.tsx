"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TOPIC_COLORS, TOPIC_LABELS } from "@/types";
import { TopicBadge, LangBadge } from "@/components/topic-badge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TopicsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/topics").then(r => r.json()).then(d => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const pieData = data ? Object.entries(data.all_time_distribution || {})
    .map(([topic, count]) => ({
      name: TOPIC_LABELS[topic] || topic,
      value: count as number,
      color: TOPIC_COLORS[topic] || "#9CA3AF",
      topic,
    }))
    .sort((a, b) => b.value - a.value) : [];

  const totalMsgs = pieData.reduce((s, d) => s + d.value, 0);

  const heatmap: number[][] = data?.hourly_heatmap || Array(7).fill(null).map(() => Array(24).fill(0));
  const maxHeat = Math.max(1, ...heatmap.flat());

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>Topic Analytics</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{totalMsgs.toLocaleString()} total classified messages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="chart-container">
          <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>All-Time Topic Distribution</h3>
          {loading ? <div className="skeleton h-64 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [v.toLocaleString(), "Messages"]} contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Topic breakdown list */}
        <div className="chart-container">
          <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>Topic Breakdown</h3>
          {loading ? <div className="space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}</div> : (
            <div className="space-y-3">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <TopicBadge topic={item.topic} />
                  <div className="flex-1">
                    <div className="h-2 rounded-full" style={{ background: "#F1F5F9" }}>
                      <div className="h-2 rounded-full transition-all" style={{
                        width: `${totalMsgs ? (item.value / totalMsgs) * 100 : 0}%`,
                        background: item.color,
                      }} />
                    </div>
                  </div>
                  <span className="text-xs font-semibold w-12 text-right" style={{ color: "#374151" }}>
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-xs w-10 text-right" style={{ color: "#9CA3AF" }}>
                    {totalMsgs ? ((item.value / totalMsgs) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="chart-container mb-6">
        <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>Hourly Activity Heatmap</h3>
        {loading ? <div className="skeleton h-40 rounded-xl" /> : (
          <div className="overflow-x-auto">
            <div style={{ minWidth: 700 }}>
              {/* Hour labels */}
              <div className="flex mb-1" style={{ paddingLeft: 36 }}>
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="flex-1 text-center text-xs" style={{ color: "#9CA3AF", fontSize: 10 }}>
                    {h % 3 === 0 ? `${h}h` : ""}
                  </div>
                ))}
              </div>
              {/* Grid */}
              {DAYS.map((day, di) => (
                <div key={day} className="flex items-center mb-1">
                  <div className="text-xs font-medium w-8 flex-shrink-0" style={{ color: "#6B7280" }}>{day}</div>
                  {heatmap[di].map((count, h) => {
                    const intensity = count / maxHeat;
                    const bg = count === 0
                      ? "#F1F5F9"
                      : `rgba(46, 125, 50, ${0.12 + intensity * 0.88})`;
                    return (
                      <div key={h} className="flex-1 mx-0.5 rounded-sm" style={{ height: 22, background: bg, cursor: "default", position: "relative" }}
                        title={`${day} ${h}:00 — ${count} msgs`} />
                    );
                  })}
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-xs" style={{ color: "#9CA3AF" }}>Less</span>
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((v, i) => (
                  <div key={i} className="w-4 h-4 rounded-sm" style={{ background: v === 0 ? "#F1F5F9" : `rgba(46,125,50,${0.12 + v * 0.88})` }} />
                ))}
                <span className="text-xs" style={{ color: "#9CA3AF" }}>More</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Questions */}
      <div className="chart-container">
        <h3 className="text-sm font-bold mb-4" style={{ color: "#0D1F14" }}>Top 20 Questions</h3>
        {loading ? <div className="skeleton h-64 rounded-xl" /> : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Question</th>
                  <th>Count</th>
                  <th>Topic</th>
                  <th>Lang</th>
                </tr>
              </thead>
              <tbody>
                {(data?.top_questions || []).map((q: any, i: number) => (
                  <tr key={i}>
                    <td className="font-bold text-xs" style={{ color: "#9CA3AF" }}>{i + 1}</td>
                    <td className="text-xs" style={{ color: "#374151", maxWidth: 400 }}>{q.message}</td>
                    <td>
                      <span className="font-bold text-sm" style={{ color: "#2E7D32" }}>{q.count}</span>
                    </td>
                    <td><TopicBadge topic={q.topic} /></td>
                    <td><LangBadge lang={q.lang} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
