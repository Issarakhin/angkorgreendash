import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    // All-time topic distribution from topics_summary
    const summarySnap = await adminDb.collection("topics_summary").get();
    const allTimeCounts: Record<string, number> = {};
    summarySnap.docs.forEach((d: any) => {
      const counts = d.data().topic_counts || {};
      Object.entries(counts).forEach(([topic, count]: any) => {
        allTimeCounts[topic] = (allTimeCounts[topic] || 0) + count;
      });
    });

    // Top questions (group by message content)
    const convSnap = await adminDb.collection("conversations")
      .orderBy("timestamp", "desc").limit(1000).get();

    const msgCounts: Record<string, { count: number; topic: string; lang: string }> = {};
    convSnap.docs.forEach((d: any) => {
      const data = d.data();
      const msg = data.user_message?.substring(0, 100)?.trim();
      if (!msg) return;
      if (!msgCounts[msg]) {
        msgCounts[msg] = { count: 0, topic: data.detected_topic, lang: data.language_used };
      }
      msgCounts[msg].count++;
    });

    const top_questions = Object.entries(msgCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([message, v]) => ({ message, ...v }));

    // Hourly heatmap [7 days][24 hours]
    const hourly_heatmap: number[][] = Array.from({ length: 7 }, () => new Array(24).fill(0));
    convSnap.docs.forEach((d: any) => {
      const ts = d.data().timestamp?.toDate?.();
      if (!ts) return;
      const day = ts.getDay(); // 0=Sun
      const hour = ts.getHours();
      hourly_heatmap[day][hour]++;
    });

    return NextResponse.json({ all_time_distribution: allTimeCounts, top_questions, hourly_heatmap });
  } catch (err) {
    console.error("Topics API error:", err);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
