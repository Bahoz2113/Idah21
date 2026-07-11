import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@cezeri/auth";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.CRON_SECRET && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sb = createServiceClient();
  const now  = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year  = prev.getFullYear();
  const month = prev.getMonth() + 1;
  try {
    await sb.from("monthly_archive_log").upsert(
      { organizationId: "org_cezeri", year, month, archivedAt: new Date().toISOString(), summary: JSON.stringify({ year, month }) },
      { onConflict: "organizationId,year,month" }
    );
    return NextResponse.json({ success: true, message: `${year}-${month} arşivlendi.` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
