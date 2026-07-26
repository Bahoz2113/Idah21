import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkOnly } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Faz 1 PWA kapsami: yalnizca statik kabuk + "Bugun" gorunumu onbelleklenir.
 * Yayin/ayarlar/X OAuth uc noktalari her zaman network-only — master prompt
 * md. 21 "Cevrimdisiyken yalnizca guvenli onbelleklenmis taslak goruntuleme;
 * yayinlama ve hesap ayari yok".
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
