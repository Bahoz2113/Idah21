import { TRPCError } from "@trpc/server";

// Basit in-memory sliding window rate limiter
// Production'da: Upstash Redis + @upstash/ratelimit kullan
const windows = new Map<string, number[]>();

export function checkRateLimit(userId: string, action: string, maxPerMinute: number) {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const window = 60_000; // 1 dakika
  const hits = (windows.get(key) ?? []).filter((t) => now - t < window);
  hits.push(now);
  windows.set(key, hits);

  // Hafıza sızıntısını engelle (1000 kullanıcıdan fazlaysa en eski 500'ü temizle)
  if (windows.size > 1000) {
    const entries = [...windows.entries()];
    entries.slice(0, 500).forEach(([k]) => windows.delete(k));
  }

  if (hits.length > maxPerMinute) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: `Çok fazla istek. Lütfen 1 dakika bekleyin. (${action}: ${maxPerMinute}/dk)`,
    });
  }
}
