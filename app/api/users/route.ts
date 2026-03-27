import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("size") || "50");

  try {
    const snap = await adminDb.collection("users").orderBy("message_count", "desc").get();
    const docs = snap.docs.map((d: any) => ({
      ...d.data(),
      first_seen: d.data().first_seen?.toDate?.()?.toISOString() || null,
      last_active: d.data().last_active?.toDate?.()?.toISOString() || null,
    }));

    const total = docs.length;
    const pages = Math.ceil(total / pageSize);
    const data = docs.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({ data, total, page, pages });
  } catch (err) {
    console.error("Users API error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
