export interface Conversation {
  id: string;
  user_id: string;
  timestamp: Date | any;
  user_message: string;
  bot_response: string;
  detected_topic: Topic;
  detected_intent: Intent;
  detected_product: string;
  language_used: Language;
  session_id: string;
  chat_type: "private" | "group" | "supergroup";
  group_id?: string;
  group_title?: string;
}

export type Topic =
  | "products" | "machinery" | "agfeed" | "exports"
  | "hr_policy" | "finance_policy" | "training" | "contact" | "general";

export type Intent =
  | "inquiry" | "purchase_interest" | "complaint"
  | "support" | "greeting" | "farewell" | "general";

export type Language = "km" | "en" | "mixed";

export interface UserStats {
  user_id: string;
  username?: string;
  first_name: string;
  first_seen: Date | any;
  last_active: Date | any;
  message_count: number;
  session_count: number;
  language_code?: string;
}

export interface GroupStats {
  group_id: string;
  title: string;
  type: string;
  first_seen: Date | any;
  last_active: Date | any;
  message_count: number;
  member_count?: number;
  active_users?: number;
}

export interface TopicSummary {
  date: string;
  topic_counts: Record<string, number>;
  total_messages: number;
  active_users: number;
}

export interface ConversationFilter {
  topic?: string;
  language?: string;
  chatType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface DashboardStats {
  total_users: number;
  total_messages: number;
  messages_today: number;
  active_last_24h: number;
  total_groups: number;
  group_messages: number;
  top_topic_today: string;
  topic_chart_7d: { date: string; topic_counts: Record<string, number> }[];
  volume_chart_30d: { date: string; count: number }[];
}

export const TOPIC_COLORS: Record<string, string> = {
  products: "#22c55e",
  machinery: "#3b82f6",
  agfeed: "#f97316",
  exports: "#a855f7",
  hr_policy: "#eab308",
  finance_policy: "#ec4899",
  training: "#06b6d4",
  contact: "#64748b",
  general: "#9ca3af",
};

export const TOPIC_LABELS: Record<string, string> = {
  products: "ផលិតផល",
  machinery: "គ្រឿងយន្ត",
  agfeed: "AG-Feed",
  exports: "នាំចេញ",
  hr_policy: "HR Policy",
  finance_policy: "Finance",
  training: "Training",
  contact: "Contact",
  general: "General",
};
