import { createHash } from "crypto";

export const ACCESS_COOKIE  = "ceos_at";   // erişim JWT'si — httpOnly, 8 saat
export const REFRESH_COOKIE = "ceos_rt";   // opak yenileme token'ı — httpOnly, 30 gün
export const DEVICE_COOKIE  = "ceos_dev";  // cihaz kimliği (çerez) — httpOnly değil, sadece rastgele id

const isProd = process.env.NODE_ENV === "production";

export const ACCESS_TTL_SECONDS  = 8 * 60 * 60;        // 8 saat
export const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;  // 30 gün

export function accessCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_TTL_SECONDS,
  };
}

export function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/api/auth", // yalnızca auth endpoint'lerine gönderilir — gereksiz maruziyeti azaltır
    maxAge: REFRESH_TTL_SECONDS,
  };
}

export function deviceCookieOptions() {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 400 * 24 * 60 * 60, // ~400 gün (tarayıcı azami sınırı)
  };
}

/** Cihaz parmak izi: User-Agent + rastgele cihaz çerezi birleşimi, hash'lenir */
export function deviceFingerprint(userAgent: string, deviceId: string): string {
  return createHash("sha256").update(`${userAgent}::${deviceId}`).digest("hex");
}
