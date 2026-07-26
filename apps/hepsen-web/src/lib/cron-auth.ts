import "server-only";
import type { NextRequest } from "next/server";

/**
 * Vercel Cron, proje env'inde CRON_SECRET tanimliysa istege otomatik olarak
 * `Authorization: Bearer <CRON_SECRET>` header'i ekler. Bu, internal job
 * route'larinin dis dunyaya acik kalmasini engelleyen TEK kontroldur.
 */
export function isAuthorizedCronRequest(request: NextRequest, cronSecret: string): boolean {
  if (!cronSecret) return false;
  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}
