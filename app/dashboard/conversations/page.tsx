"use client";
import { useEffect, useState } from "react";
import { TopicBadge, LangBadge, ChatTypeBadge } from "@/components/topic-badge";
import { TOPIC_LABELS } from "@/types";
import { format } from "date-fns";

const TOPICS = ["", ...Object.keys(TOPIC_LABELS)];
const LANGS = ["", "km", "en", "mixed"];
const CHAT_TYPES = ["", "private", "group", "supergroup"];

export default function ConversationsPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [filters, setFilters] = useState({ topic: "", language: "", chatType: "", dateFrom: "", dateTo: "", search: "" });

  async function fetchData(p = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), size: "20" });
    if (filters.topic) params.set("topic", filters.topic);
    if (filters.language) params.set("language", filters.language);
    if (filters.chatType) params.set("chatType", filters.chatType);
    if (filters.dateFrom) params.set("from", filters.dateFrom);
    if (filters.dateTo) params.set("to", filters.dateTo);
    if (filters.search) params.set("search", filters.search);
    const res = await fetch(`/api/conversations?${params}`);
    const json = await res.json();
    setData(json.data || []);
    setTotal(json.total || 0);
    setPages(json.pages || 1);
    setPage(p);
    setLoading(false);
  }

  useEffect(() => { fetchData(1); }, []);

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    fetchData(1);
  }

  const selClass = "input-field text-sm";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>Conversations</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{total.toLocaleString()} total conversations</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="chart-container mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <select className={selClass} value={filters.topic} onChange={e => setFilters(f => ({ ...f, topic: e.target.value }))}>
            <option value="">All Topics</option>
            {Object.entries(TOPIC_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select className={selClass} value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
            <option value="">All Languages</option>
            <option value="km">Khmer</option>
            <option value="en">English</option>
            <option value="mixed">Mixed</option>
          </select>
          <select className={selClass} value={filters.chatType} onChange={e => setFilters(f => ({ ...f, chatType: e.target.value }))}>
            <option value="">All Types</option>
            <option value="private">Private</option>
            <option value="group">Group</option>
            <option value="supergroup">Supergroup</option>
          </select>
          <input type="date" className={selClass} value={filters.dateFrom}
            onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} placeholder="From" />
          <input type="date" className={selClass} value={filters.dateTo}
            onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} placeholder="To" />
          <input className={selClass} value={filters.search} placeholder="Search..."
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
          <button type="submit" className="btn-primary">Apply</button>
        </div>
      </form>

      {/* Table */}
      <div className="chart-container">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Time</th>
                <th>Message</th>
                <th>Topic</th>
                <th>Type</th>
                <th>Group</th>
                <th>Lang</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={7}><div className="skeleton h-5 w-full my-1" /></td></tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10" style={{ color: "#9CA3AF" }}>No conversations found</td></tr>
              ) : data.map((c: any) => (
                <>
                  <tr key={c.id} className="cursor-pointer" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    <td className="font-mono text-xs">{c.user_id?.substring(0, 10)}...</td>
                    <td className="text-xs whitespace-nowrap" style={{ color: "#9CA3AF" }}>
                      {c.timestamp ? format(new Date(c.timestamp), "MM/dd HH:mm") : "—"}
                    </td>
                    <td>
                      <span className="text-xs" style={{ color: "#374151" }}>
                        {c.user_message?.substring(0, 55)}{c.user_message?.length > 55 ? "…" : ""}
                      </span>
                    </td>
                    <td><TopicBadge topic={c.detected_topic} /></td>
                    <td><ChatTypeBadge type={c.chat_type} /></td>
                    <td className="text-xs" style={{ color: "#6B7280" }}>{c.group_title || "—"}</td>
                    <td><LangBadge lang={c.language_used} /></td>
                  </tr>
                  {expanded === c.id && (
                    <tr key={`${c.id}-exp`}>
                      <td colSpan={7} className="p-0">
                        <div className="mx-4 mb-3 p-4 rounded-xl" style={{ background: "#F8FFF9", border: "1px solid #BBF7D0" }}>
                          <div className="flex gap-3 mb-3">
                            <div className="flex-1">
                              <p className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>👤 User</p>
                              <p className="text-sm p-3 rounded-lg" style={{ background: "#E8F5E9", color: "#1B5E20" }}>{c.user_message}</p>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>🌿 ARIA</p>
                              <p className="text-sm p-3 rounded-lg whitespace-pre-wrap" style={{ background: "#fff", color: "#374151", border: "1px solid #E2E8F0" }}>{c.bot_response}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs" style={{ color: "#9CA3AF" }}>
                            <span>Session: {c.session_id}</span>
                            <span>·</span>
                            <span>Intent: {c.detected_intent}</span>
                            {c.detected_product && <><span>·</span><span>Product: {c.detected_product}</span></>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: "1px solid #F1F5F9" }}>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>Page {page} of {pages}</p>
          <div className="flex gap-2">
            <button className="btn-outline text-xs px-3 py-1.5" disabled={page <= 1} onClick={() => fetchData(page - 1)}>← Prev</button>
            <button className="btn-outline text-xs px-3 py-1.5" disabled={page >= pages} onClick={() => fetchData(page + 1)}>Next →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
