import { NextResponse, type NextRequest } from "next/server";
import { generateCodeVerifier, codeChallengeS256, generateState, buildAuthorizeUrl } from "@/lib/x/oauth";
import { getServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "x_oauth_state";
const VERIFIER_COOKIE = "x_oauth_verifier";
const TTL_SECONDS = 10 * 60;

export async function GET(request: NextRequest) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const rl = checkRateLimit(`x-connect:${user.id}`, 5, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Çok fazla istek, birazdan tekrar deneyin." }, { status: 429 });
  }

  const verifier = generateCodeVerifier();
  const state = generateState();
  const authorizeUrl = buildAuthorizeUrl({ state, codeChallenge: codeChallengeS256(verifier) });

  const response = NextResponse.redirect(authorizeUrl);
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: TTL_SECONDS,
    path: "/",
  };
  response.cookies.set(STATE_COOKIE, state, cookieOpts);
  response.cookies.set(VERIFIER_COOKIE, verifier, cookieOpts);
  return response;
}
