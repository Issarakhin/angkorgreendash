"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function GroupsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/groups").then(r => r.json()).then(json => {
      setData(json.data || []);
      setLoading(false);
    });
  }, []);

  const filtered = data.filter(g =>
    !search || g.title?.toLowerCase().includes(search.toLowerCase()) || g.group_id?.includes(search)
  );

  const totalMsgs = data.reduce((s, g) => s + (g.message_count || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#0D1F14" }}>Groups</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          {data.length} groups · {totalMsgs.toLocaleString()} total group messages
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Groups", value: data.length, icon: "👥", color: "#059669" },
          { label: "Total Messages", value: totalMsgs, icon: "💬", color: "#2E7D32" },
          { label: "Most Active", value: data[0]?.title?.substring(0, 20) || "—", icon: "🔥", color: "#F59E0B" },
        ].map((s, i) => (
          <div key={i} className="stat-card p-5 flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>{s.label}</p>
              <p className="text-xl font-bold" style={{ color: "#0D1F14" }}>
                {typeof s.value === "number" ? s.value.toLocaleString() : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <div className="mb-4">
          <input className="input-field w-full md:w-64" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Group ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Members</th>
                <th>Messages</th>
                <th>First Seen</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => <tr key={i}><td colSpan={7}><div className="skeleton h-5 w-full my-1" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12" style={{ color: "#9CA3AF" }}>
                  {data.length === 0
                    ? "No groups yet — add ARIA to a Telegram group to start tracking!"
                    : "No matching groups"}
                </td></tr>
              ) : filtered.map((g: any) => (
                <>
                  <tr key={g.group_id} className="cursor-pointer" onClick={() => setSelected(g === selected ? null : g)}>
                    <td className="font-mono text-xs">{g.group_id}</td>
                    <td className="font-semibold text-sm" style={{ color: "#1B5E20" }}>{g.title}</td>
                    <td>
                      <span className="topic-badge" style={{
                        background: g.type === "supergroup" ? "#7C3AED18" : "#2E7D3218",
                        color: g.type === "supergroup" ? "#7C3AED" : "#2E7D32",
                      }}>
                        {g.type}
                      </span>
                    </td>
                    <td className="text-sm">{g.member_count?.toLocaleString() || "—"}</td>
                    <td><span className="font-bold" style={{ color: "#2E7D32" }}>{g.message_count?.toLocaleString() || 0}</span></td>
                    <td className="text-xs" style={{ color: "#9CA3AF" }}>{g.first_seen ? format(new Date(g.first_seen), "yyyy/MM/dd") : "—"}</td>
                    <td className="text-xs" style={{ color: "#9CA3AF" }}>{g.last_active ? format(new Date(g.last_active), "MM/dd HH:mm") : "—"}</td>
                  </tr>
                  {selected?.group_id === g.group_id && (
                    <tr key={`${g.group_id}-exp`}>
                      <td colSpan={7} className="p-0">
                        <div className="mx-4 mb-3 p-4 rounded-xl" style={{ background: "#F8FFF9", border: "1px solid #BBF7D0" }}>
                          <h4 className="font-bold text-sm mb-3" style={{ color: "#1B5E20" }}>📊 {g.title}</h4>
                          <div className="grid grid-cols-4 gap-4 text-xs" style={{ color: "#374151" }}>
                            <div><span style={{ color: "#9CA3AF" }}>Group ID:</span><br />{g.group_id}</div>
                            <div><span style={{ color: "#9CA3AF" }}>Type:</span><br />{g.type}</div>
                            <div><span style={{ color: "#9CA3AF" }}>Members:</span><br />{g.member_count || "Unknown"}</div>
                            <div><span style={{ color: "#9CA3AF" }}>Total Messages:</span><br />{g.message_count}</div>
                          </div>
                          <div className="mt-3">
                            <a href={`/dashboard/conversations?chatType=${g.type}&search=${g.group_id}`}
                              className="text-xs font-semibold" style={{ color: "#2E7D32" }}>
                              View conversations in this group →
                            </a>
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
      </div>
    </div>
  );
}
