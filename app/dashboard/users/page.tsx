"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function UsersPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("message_count");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/conversations?size=500")
      .then(r => r.json()).then(async (convData) => {
        // Build user list from users collection via stats
        const res = await fetch("/api/stats");
        const stats = await res.json();
        // Fetch users directly — use a dedicated users API pattern
        const usersRes = await fetch("/api/conversations?size=1&page=1");
        setLoading(false);
      });
    // Directly call users endpoint
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const json = await res.json();
        setData(json.data || []);
      }
    } catch {}
    setLoading(false);
  }

  const filtered = data.filter(u =>
    !search ||
    u.user_id?.includes(search) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b[sort] || 0) - (a[sort] || 0));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>Users</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{data.length.toLocaleString()} registered users</p>
      </div>

      <div className="chart-container">
        <div className="flex gap-3 mb-4">
          <input className="input-field flex-1" placeholder="Search by name, ID, username..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input-field" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="message_count">Most Messages</option>
            <option value="session_count">Most Sessions</option>
            <option value="last_active">Recently Active</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>First Name</th>
                <th>First Seen</th>
                <th>Last Active</th>
                <th>Messages</th>
                <th>Sessions</th>
                <th>Lang</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton h-5 w-full my-1" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12" style={{ color: "#9CA3AF" }}>
                  {data.length === 0 ? "No users yet — start the bot and send a message!" : "No matching users"}
                </td></tr>
              ) : filtered.map((u: any) => (
                <tr key={u.user_id} className="cursor-pointer" onClick={() => setSelected(u === selected ? null : u)}>
                  <td className="font-mono text-xs">{u.user_id}</td>
                  <td className="font-medium text-sm">{u.first_name || "—"}{u.username ? <span className="text-xs ml-1" style={{ color: "#9CA3AF" }}>@{u.username}</span> : null}</td>
                  <td className="text-xs" style={{ color: "#9CA3AF" }}>{u.first_seen ? format(new Date(u.first_seen), "yyyy/MM/dd") : "—"}</td>
                  <td className="text-xs" style={{ color: "#9CA3AF" }}>{u.last_active ? format(new Date(u.last_active), "MM/dd HH:mm") : "—"}</td>
                  <td><span className="font-bold" style={{ color: "#2E7D32" }}>{u.message_count || 0}</span></td>
                  <td><span className="text-sm" style={{ color: "#374151" }}>{u.session_count || 0}</span></td>
                  <td><span className="topic-badge text-xs" style={{ background: "#7C3AED18", color: "#7C3AED" }}>{u.language_code || "km"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selected && (
          <div className="mt-4 p-4 rounded-xl" style={{ background: "#F8FFF9", border: "1px solid #BBF7D0" }}>
            <h4 className="font-bold text-sm mb-2" style={{ color: "#1B5E20" }}>User Detail — {selected.first_name}</h4>
            <div className="grid grid-cols-3 gap-4 text-xs" style={{ color: "#374151" }}>
              <div><span style={{ color: "#9CA3AF" }}>User ID:</span> {selected.user_id}</div>
              <div><span style={{ color: "#9CA3AF" }}>Username:</span> @{selected.username || "—"}</div>
              <div><span style={{ color: "#9CA3AF" }}>Language:</span> {selected.language_code}</div>
              <div><span style={{ color: "#9CA3AF" }}>Messages:</span> {selected.message_count}</div>
              <div><span style={{ color: "#9CA3AF" }}>Sessions:</span> {selected.session_count}</div>
              <div><span style={{ color: "#9CA3AF" }}>First Seen:</span> {selected.first_seen ? format(new Date(selected.first_seen), "yyyy-MM-dd HH:mm") : "—"}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
