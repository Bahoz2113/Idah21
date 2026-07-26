import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { getEnv } from "@/lib/env";

/** bkz. docs/adr/0002-x-api-pricing-oauth.md */
export const X_AUTHORIZE_URL = "https://x.com/i/oauth2/authorize";
export const X_TOKEN_URL = "https://api.x.com/2/oauth2/token";
export const X_SCOPES = ["tweet.read", "tweet.write", "users.read", "offline.access"] as const;

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier(): string {
  return base64url(randomBytes(48)); // 64 char, RFC 7636 43-128 araliginda
}

export function codeChallengeS256(verifier: string): string {
  return base64url(createHash("sha256").update(verifier).digest());
}

export function generateState(): string {
  return base64url(randomBytes(24));
}

export function buildAuthorizeUrl(params: { state: string; codeChallenge: string }): string {
  const env = getEnv();
  const url = new URL(X_AUTHORIZE_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.X_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.X_REDIRECT_URI);
  url.searchParams.set("scope", X_SCOPES.join(" "));
  url.searchParams.set("state", params.state);
  url.searchParams.set("code_challenge", params.codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export interface XTokenResponse {
  token_type: string;
  expires_in: number;
  access_token: string;
  scope: string;
  refresh_token?: string;
}

export async function exchangeCodeForToken(params: {
  code: string;
  codeVerifier: string;
}): Promise<XTokenResponse> {
  const env = getEnv();
  const basicAuth = Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: env.X_REDIRECT_URI,
    code_verifier: params.codeVerifier,
  });
  const res = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body,
  });
  if (!res.ok) {
    // X hata govdesi token icermez ama yine de govdeyi loglamiyoruz, sadece status.
    throw new Error(`X token exchange basarisiz: HTTP ${res.status}`);
  }
  return (await res.json()) as XTokenResponse;
}

export async function revokeToken(token: string): Promise<void> {
  const env = getEnv();
  const basicAuth = Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString("base64");
  const body = new URLSearchParams({ token, token_type_hint: "access_token" });
  await fetch("https://api.x.com/2/oauth2/revoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body,
  });
  // Best-effort: X revoke ucu 200 disi donerse bile disconnect akisini durdurmuyoruz.
}

export async function refreshAccessToken(refreshToken: string): Promise<XTokenResponse> {
  const env = getEnv();
  const basicAuth = Buffer.from(`${env.X_CLIENT_ID}:${env.X_CLIENT_SECRET}`).toString("base64");
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  const res = await fetch(X_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`X token yenileme basarisiz: HTTP ${res.status}`);
  }
  return (await res.json()) as XTokenResponse;
}
