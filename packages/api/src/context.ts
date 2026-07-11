import { prisma } from "@cezeri/database";
import { verifyAccessToken, ACCESS_COOKIE, type SessionUser } from "@cezeri/auth";

/** Basit Cookie header ayrıştırıcı (ek bağımlılık gerektirmez) */
function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

// Her istekte httpOnly "ceos_at" çerezindeki JWT doğrulanır -> DB'den
// güncel rol/orgId/status çekilir (JWT'ye güvenmek yerine her seferinde
// taze veri okunur; admin bir kullanıcıyı pasifleştirirse aktif oturum
// bir sonraki istekte anında düşer).
export async function createContext(opts: { headers: Headers }) {
  let user: SessionUser | null = null;

  const cookies = parseCookies(opts.headers.get("cookie"));
  const token = cookies["ceos_at"];

  if (token) {
    const payload = await verifyAccessToken(token);
    if (payload?.sub) {
      const dbUser = await prisma.user.findFirst({
        where: { id: payload.sub, status: "ACTIVE" },
        select: { id: true, organizationId: true, role: true, email: true },
      });
      if (dbUser) user = dbUser as SessionUser;
    }
  }

  return { prisma, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
