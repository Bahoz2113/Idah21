import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "@cezeri/api";      // SADECE tip — sunucu kodu bundle'a girmez

// Web ve mobilin paylaştığı TEK tRPC örneği
export const trpc = createTRPCReact<AppRouter>();

// Ortak link kurucu — httpOnly cookie'ler (ceos_at) fetch ile otomatik gönderilir.
// Artık Authorization header manuel eklenmiyor; oturum tamamen sunucu tarafında
// httpOnly cookie üzerinden yönetiliyor (XSS'e karşı token JS'e hiç açılmıyor).
// Erişim jetonu süresi dolarsa (401) bir kez /api/auth/refresh denenip istek tekrarlanır.
export function makeLinks(apiUrl: string) {
  return [
    httpBatchLink({
      url: apiUrl,
      transformer: superjson,
      fetch: async (url, options) => {
        const doFetch = () => fetch(url, { ...options, credentials: "include" });
        let res = await doFetch();
        if (res.status === 401) {
          const refreshed = await fetch(apiUrl.replace(/\/trpc$/, "/auth/refresh"), {
            method: "POST",
            credentials: "include",
          }).then((r) => r.ok).catch(() => false);
          if (refreshed) res = await doFetch();
        }
        return res;
      },
    }),
  ];
}
