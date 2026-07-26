# HEP-SEN Batman — Mimari (Faz 0+1)

## Genel bakış

```
KULLANICI (tek yönetici hesabı)
  └─ apps/hepsen-web (Next.js App Router, PWA)
       ├─ Supabase Auth (email+password)
       ├─ 5 panel: Bugün / Taslaklar / Takvim / Analiz / Ayarlar
       ├─ /api/auth/x/{connect,callback,disconnect} (OAuth 2.0 PKCE)
       └─ @hepsen/core (saf iş mantığı: blocklist, durum makinesi,
          bütçe guard, puanlama, prompt katmanları — network/DB'siz)
              │
              ▼
       Supabase PostgreSQL ("hepsen-batman" projesi, RLS aktif)
```

## Monorepo konumu

Bu ürün, CEZERİ ROBOTECH Education OS ile **aynı pnpm workspace**'te ama
tamamen izole yaşıyor:

- `packages/core` → `@hepsen/core` — saf mantık, testli (62/62), her iki
  üründen de bağımsız çalışabilir.
- `apps/hepsen-web` — yeni, izole Next.js uygulaması. `apps/web` (CEZERİ)
  koduna hiçbir import/bağımlılık yok.
- Ayrı Supabase projesi (`hepsen-batman`), CEZERİ'nin veritabanından tamamen
  bağımsız — şema karışması veya RLS çakışması yok.

## Neden bu ayrım?

CEZERİ kendi özel JWT+TOTP tabanlı auth'unu kullanıyor (`packages/auth`),
Supabase Auth kullanmıyor. HEP-SEN Batman master prompt'u Supabase Auth
istiyor — iki auth modeli aynı uygulamada çakışmaz çünkü ayrı Next.js
uygulamaları, ayrı Supabase projeleri.

## Katmanlar (`apps/hepsen-web/src`)

- `app/` — route'lar (App Router route grupları: `(auth)`, `(panel)`, `api`).
- `lib/env.ts` — Zod ile fail-fast ortam değişkeni doğrulama.
- `lib/supabase/` — server (RLS'li + service-role), browser, middleware client'ları.
- `lib/crypto/token-cipher.ts` — X token'larını AES-256-GCM ile şifreler.
- `lib/x/` — OAuth 2.0 PKCE akışı ve X API client'ı.
- `lib/audit/log.ts` — `audit_logs` tablosuna TEK yazma noktası.
- `lib/budget-config.ts` — `@hepsen/core`'un `BudgetConfig`'ini env'den kurar.
- `components/` — UI primitifleri (button/card/badge), panel navigasyonu,
  bütçe göstergesi.

## Faz 2+'da eklenecek katmanlar (bu turda yok)

`lib/apify/`, `lib/rss/`, `lib/sources/`, `lib/timing/`, `lib/tone-guard/`,
`jobs/*.ts` (collect-daily, generate-drafts, publish-approved, vb.) — master
prompt "7. KLASÖR YAPISI" bölümünde tanımlı, Faz 2-5'te eklenecek.
