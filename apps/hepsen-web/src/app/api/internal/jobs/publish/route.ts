import { NextResponse, type NextRequest } from "next/server";
import { getEnv } from "@/lib/env";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { publishDueDrafts } from "@/lib/jobs/publish-due-drafts";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

// Vercel Cron istekleri GET ile gelir; POST manuel/lokal tetikleme icin ayni mantigi kullanir.
export { handlePublishJob as GET, handlePublishJob as POST };

async function handlePublishJob(request: NextRequest) {
  const env = getEnv();
  if (!isAuthorizedCronRequest(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const result = await publishDueDrafts(supabase);
  return NextResponse.json(result);
}
