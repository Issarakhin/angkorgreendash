import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic");
  const language = searchParams.get("language");
  const chatType = searchParams.get("chatType");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "20");
  const search = searchParams.get("search");

  try {
    let query: any = adminDb.collection("conversations").orderBy("timestamp", "desc");

    if (topic) query = query.where("detected_topic", "==", topic);
    if (language) query = query.where("language_used", "==", language);
    if (chatType) query = query.where("chat_type", "==", chatType);
    if (from) query = query.where("timestamp", ">=", new Date(from));
    if (to) query = query.where("timestamp", "<=", new Date(to + "T23:59:59Z"));

    const snap = await query.limit(500).get();
    let docs = snap.docs.map((d: any) => ({
      id: d.id,
      ...d.data(),
      timestamp: d.data().timestamp?.toDate?.()?.toISOString() || null,
    }));

    // Client-side search filter
    if (search) {
      const q = search.toLowerCase();
      docs = docs.filter((d: any) =>
        d.user_message?.toLowerCase().includes(q) ||
        d.bot_response?.toLowerCase().includes(q) ||
        d.user_id?.includes(q)
      );
    }

    const total = docs.length;
    const pages = Math.ceil(total / pageSize);
    const data = docs.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({ data, total, page, pages, pageSize });
  } catch (err) {
    console.error("Conversations API error:", err);
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}
