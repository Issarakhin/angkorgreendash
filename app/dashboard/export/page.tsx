"use client";
import { useState } from "react";
import { TOPIC_LABELS } from "@/types";

interface ExportConfig {
  type: string;
  from: string;
  to: string;
  topic: string;
  format: string;
}

function ExportCard({ title, description, icon, config, onExport }: {
  title: string; description: string; icon: string;
  config: Partial<ExportConfig>; onExport: (c: ExportConfig) => void;
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [topic, setTopic] = useState("");
  const [fmt, setFmt] = useState("csv");
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    await onExport({ type: config.type || "conversations", from, to, topic, format: fmt });
    setLoading(false);
  }

  return (
    <div className="chart-container">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-bold text-sm" style={{ color: "#0D1F14" }}>{title}</h3>
          <p className="text-xs" style={{ color: "#6B7280" }}>{description}</p>
        </div>
      </div>
      <div className="space-y-3">
        {config.type === "conversations" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#9CA3AF" }}>Date From</label>
                <input type="date" className="input-field w-full" value={from} onChange={e => setFrom(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#9CA3AF" }}>Date To</label>
                <input type="date" className="input-field w-full" value={to} onChange={e => setTo(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "#9CA3AF" }}>Topic Filter</label>
              <select className="input-field w-full" value={topic} onChange={e => setTopic(e.target.value)}>
                <option value="">All Topics</option>
                {Object.entries(TOPIC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </>
        )}
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "#9CA3AF" }}>Format</label>
          <div className="flex gap-3">
            {["csv", "json"].map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`fmt-${title}`} value={f} checked={fmt === f} onChange={() => setFmt(f)}
                  className="accent-green-600" />
                <span className="text-sm font-medium uppercase" style={{ color: "#374151" }}>{f}</span>
              </label>
            ))}
          </div>
        </div>
        <button onClick={handleExport} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {loading ? "Exporting..." : `Download ${fmt.toUpperCase()}`}
        </button>
      </div>
    </div>
  );
}

export default function ExportPage() {
  async function handleExport(config: ExportConfig) {
    const params = new URLSearchParams({ type: config.type, format: config.format });
    if (config.from) params.set("from", config.from);
    if (config.to) params.set("to", config.to);
    if (config.topic) params.set("topic", config.topic);

    const res = await fetch(`/api/export?${params}`);
    if (!res.ok) { alert("Export failed. Try again."); return; }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().split("T")[0];
    a.download = `agid_${config.type}_${date}.${config.format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>Export Data</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Download conversations, users, and group data as CSV or JSON</p>
      </div>

      {/* Info banner */}
      <div className="p-4 rounded-xl mb-6 flex items-start gap-3" style={{ background: "#E8F5E9", border: "1px solid #A5D6A7" }}>
        <span className="text-lg">ℹ️</span>
        <div className="text-sm" style={{ color: "#1B5E20" }}>
          <strong>Export limits:</strong> Max 5,000 conversations per export. For larger datasets, apply date filters to split exports.
          All exports are in UTF-8 encoding with Khmer text support.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExportCard
          title="Conversations"
          description="All chat messages with topic, intent, language, and chat type"
          icon="💬"
          config={{ type: "conversations" }}
          onExport={handleExport}
        />
        <ExportCard
          title="User Stats"
          description="All registered users with message counts and activity dates"
          icon="👤"
          config={{ type: "users" }}
          onExport={handleExport}
        />
        <ExportCard
          title="Group Stats"
          description="All Telegram groups with message volumes and member counts"
          icon="👥"
          config={{ type: "groups" }}
          onExport={handleExport}
        />
      </div>

      {/* Data dictionary */}
      <div className="chart-container mt-6">
        <h3 className="font-bold text-sm mb-4" style={{ color: "#0D1F14" }}>📋 Export Field Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Conversations Fields</h4>
            <div className="space-y-1">
              {[
                ["id", "Firestore document ID"],
                ["user_id", "Telegram user ID"],
                ["timestamp", "ISO 8601 datetime"],
                ["user_message", "User's message text"],
                ["bot_response", "ARIA's response"],
                ["detected_topic", "products | machinery | agfeed | hr_policy | ..."],
                ["detected_intent", "inquiry | purchase_interest | greeting | ..."],
                ["language_used", "km | en | mixed"],
                ["chat_type", "private | group | supergroup"],
                ["group_id", "Telegram group ID (if group)"],
                ["group_title", "Group name (if group)"],
              ].map(([f, d]) => (
                <div key={f} className="flex gap-3 text-xs">
                  <code className="font-mono w-32 flex-shrink-0" style={{ color: "#2E7D32" }}>{f}</code>
                  <span style={{ color: "#6B7280" }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#9CA3AF" }}>Topic Codes</h4>
            <div className="space-y-1">
              {Object.entries(TOPIC_LABELS).map(([k, v]) => (
                <div key={k} className="flex gap-3 text-xs">
                  <code className="font-mono w-32 flex-shrink-0" style={{ color: "#2E7D32" }}>{k}</code>
                  <span style={{ color: "#6B7280" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
