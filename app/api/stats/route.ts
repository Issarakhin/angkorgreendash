import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { subDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    const todayStart = startOfDay(now);
    const yesterday = subDays(now, 1);

    // Total users
    const usersSnap = await adminDb.collection("users").count().get();
    const total_users = usersSnap.data().count;

    // Total groups
    const groupsSnap = await adminDb.collection("groups").count().get();
    const total_groups = groupsSnap.data().count;

    // Total messages
    const msgsSnap = await adminDb.collection("conversations").count().get();
    const total_messages = msgsSnap.data().count;

    // Messages today
    const todayMsgsSnap = await adminDb.collection("conversations")
      .where("timestamp", ">=", todayStart).count().get();
    const messages_today = todayMsgsSnap.data().count;

    // Group messages today
    const groupMsgsSnap = await adminDb.collection("conversations")
      .where("chat_type", "in", ["group", "supergroup"]).count().get();
    const group_messages = groupMsgsSnap.data().count;

    // Active last 24h
    const activeCutoff = subDays(now, 1);
    const activeSnap = await adminDb.collection("users")
      .where("last_active", ">=", activeCutoff).count().get();
    const active_last_24h = activeSnap.data().count;

    // Topic chart — last 7 days
    const topic_chart_7d = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(now, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const docSnap = await adminDb.collection("topics_summary").doc(dateStr).get();
      const data = docSnap.data();
      topic_chart_7d.push({
        date: dateStr,
        topic_counts: data?.topic_counts || {},
        total: data?.total_messages || 0,
      });
    }

    // Volume chart — last 30 days
    const volume_chart_30d = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(now, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const docSnap = await adminDb.collection("topics_summary").doc(dateStr).get();
      volume_chart_30d.push({
        date: dateStr,
        count: docSnap.data()?.total_messages || 0,
      });
    }

    // Top topic today
    const todayDoc = await adminDb.collection("topics_summary").doc(todayStr).get();
    const todayCounts = todayDoc.data()?.topic_counts || {};
    const top_topic_today = Object.entries(todayCounts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "general";

    return NextResponse.json({
      total_users,
      total_messages,
      messages_today,
      active_last_24h,
      total_groups,
      group_messages,
      top_topic_today,
      topic_chart_7d,
      volume_chart_30d,
    });
  } catch (err) {
    console.error("Stats API error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
