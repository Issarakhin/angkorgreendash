interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}

export default function StatCard({ label, value, sub, icon, color, trend }: StatCardProps) {
  return (
    <div className="stat-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9CA3AF" }}>{label}</p>
          <p className="text-3xl font-bold mt-1 tracking-tight" style={{ color: "#0D1F14" }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {sub && <p className="text-xs mt-1" style={{ color: "#6B7280" }}>{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span style={{ color: trend >= 0 ? "#22c55e" : "#ef4444" }}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
          <span style={{ color: "#9CA3AF" }}>vs yesterday</span>
        </div>
      )}
    </div>
  );
}
