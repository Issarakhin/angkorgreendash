import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "conversations";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const topic = searchParams.get("topic");
  const format = searchParams.get("format") || "csv";

  try {
    let data: any[] = [];

    if (type === "conversations") {
      let query: any = adminDb.collection("conversations").orderBy("timestamp", "desc");
      if (topic) query = query.where("detected_topic", "==", topic);
      if (from) query = query.where("timestamp", ">=", new Date(from));
      if (to) query = query.where("timestamp", "<=", new Date(to + "T23:59:59Z"));
      const snap = await query.limit(5000).get();
      data = snap.docs.map((d: any) => ({
        id: d.id,
        ...d.data(),
        timestamp: d.data().timestamp?.toDate?.()?.toISOString() || "",
      }));
    } else if (type === "users") {
      const snap = await adminDb.collection("users").orderBy("message_count", "desc").get();
      data = snap.docs.map((d: any) => ({
        ...d.data(),
        first_seen: d.data().first_seen?.toDate?.()?.toISOString() || "",
        last_active: d.data().last_active?.toDate?.()?.toISOString() || "",
      }));
    } else if (type === "groups") {
      const snap = await adminDb.collection("groups").orderBy("message_count", "desc").get();
      data = snap.docs.map((d: any) => ({
        ...d.data(),
        first_seen: d.data().first_seen?.toDate?.()?.toISOString() || "",
        last_active: d.data().last_active?.toDate?.()?.toISOString() || "",
      }));
    }

    if (format === "json") {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="agid_${type}_${new Date().toISOString().split("T")[0]}.json"`,
        },
      });
    }

    // CSV
    if (data.length === 0) {
      return new NextResponse("No data found", { status: 404 });
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
      headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const str = String(val).replace(/"/g, '""');
        return str.includes(",") || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="agid_${type}_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export API error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
