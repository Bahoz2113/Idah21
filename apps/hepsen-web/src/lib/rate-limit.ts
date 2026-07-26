import "server-only";

/**
 * Basit in-memory sliding-window rate limit. Tek instance MVP icin yeterli;
 * coklu instance/production olcek icin Upstash Redis'e tasinmali
 * (bkz. docs/security.md "Bilinen sinirlamalar").
 */
const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const timestamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return { allowed: false, remaining: 0 };
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true, remaining: limit - timestamps.length };
}
