import { TOPIC_COLORS, TOPIC_LABELS } from "@/types";

const LANG_COLORS: Record<string, string> = {
  km: "#7C3AED",
  en: "#0369A1",
  mixed: "#0F766E",
};

export function TopicBadge({ topic }: { topic: string }) {
  const color = TOPIC_COLORS[topic] || "#9CA3AF";
  const label = TOPIC_LABELS[topic] || topic;
  return (
    <span className="topic-badge"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {label}
    </span>
  );
}

export function LangBadge({ lang }: { lang: string }) {
  const color = LANG_COLORS[lang] || "#6B7280";
  return (
    <span className="topic-badge"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
      {lang}
    </span>
  );
}

export function ChatTypeBadge({ type }: { type: string }) {
  const isGroup = type === "group" || type === "supergroup";
  return (
    <span className="topic-badge"
      style={{
        background: isGroup ? "#065F4618" : "#1E3A5F18",
        color: isGroup ? "#059669" : "#1D4ED8",
        border: `1px solid ${isGroup ? "#059669" : "#1D4ED8"}30`,
      }}>
      {isGroup ? "👥 Group" : "👤 Private"}
    </span>
  );
}
