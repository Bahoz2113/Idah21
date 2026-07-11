import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createContext } from "@cezeri/api";

// Vercel serverless — Prisma engine için Node.js runtime zorunlu
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  // Vercel preview URL'leri: *.vercel.app
];

function corsHeaders(origin: string | null): Headers {
  const h = new Headers();
  const allowed = origin && (ALLOWED_ORIGINS.includes(origin) || (origin.endsWith(".vercel.app") && process.env.NODE_ENV !== "production"));
  h.set("Access-Control-Allow-Origin", allowed ? origin! : ALLOWED_ORIGINS[0]);
  h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  h.set("Access-Control-Max-Age", "86400");
  return h;
}

// Preflight
export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

const handler = async (req: Request) => {
  const origin = req.headers.get("origin");
  const res = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ headers: req.headers }),
    onError: ({ error, path }) => {
      // Production'da stack trace'leri gizle
      if (process.env.NODE_ENV === "production") {
        console.error(`[tRPC] /${path}:`, error.code);
      } else {
        console.error(`[tRPC] /${path}:`, error);
      }
    },
  });
  // CORS header'larını response'a ekle
  const cors = corsHeaders(origin);
  cors.forEach((v, k) => res.headers.set(k, v));
  return res;
};

export { handler as GET, handler as POST };
