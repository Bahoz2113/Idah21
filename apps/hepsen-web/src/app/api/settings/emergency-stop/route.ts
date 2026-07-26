import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const enabled = formData.get("enabled") === "true";
  const reason = formData.get("reason");

  await supabase.from("app_settings").upsert({
    user_id: user.id,
    emergency_stop: enabled,
    emergency_stop_reason: typeof reason === "string" && reason.length > 0 ? reason : null,
    updated_at: new Date().toISOString(),
  });

  await writeAuditLog({
    userId: user.id,
    action: "emergency_stop_toggled",
    metadata: { enabled },
  });

  return NextResponse.redirect(new URL("/settings", request.url));
}
