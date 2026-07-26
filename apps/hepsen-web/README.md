# hepsen-web

HEP-SEN Batman — Başkanlık İletişim OS'un web uygulaması (Faz 0-2: güvenli
çekirdek + gündem/taslak üretimi). İş mantığı `@hepsen/core`'dan
(`packages/core`) gelir; bu paket ağ/kimlik/UI/toplama/AI'ı ekler.

## Kurulum

```bash
cd apps/hepsen-web
cp .env.example .env.local
```

`.env.local`'i doldur:

1. **Supabase** — proje zaten oluşturuldu (`hepsen-batman`, `eu-central-1`).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase
     Dashboard → Settings → API.
   - `SUPABASE_SERVICE_ROLE_KEY`: aynı sayfa, "service_role" anahtarı
     (**gizli**, asla client'a göndermeyin).
   - `DATABASE_URL`: Settings → Database → Connection string (pooler).
2. **X Developer App**: `X_CLIENT_ID`, `X_CLIENT_SECRET` — developer.x.com'daki
   uygulamandan. `X_REDIRECT_URI` yerelde
   `http://localhost:3010/api/auth/x/callback`, production'da gerçek domain.
3. **TOKEN_ENCRYPTION_KEY**: 32 byte, base64:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
4. **ANTHROPIC_API_KEY**: mevcut Anthropic anahtarınız.
5. Yönetici hesabını Supabase Dashboard → Authentication → Users'tan
   (veya `supabase.auth.admin.createUser`) manuel oluşturun — public
   kayıt/invite akışı yok, tek yönetici hesabı varsayımı geçerli.
6. **CRON_SECRET**: 32 byte, base64 (yukarıdaki komutla aynı şekilde
   üretilir). Vercel'e deploy ederken proje env değişkenlerine aynı değeri
   ekleyin — Vercel Cron bu değeri görürse istek başına otomatik
   `Authorization: Bearer <CRON_SECRET>` header'ı ekler.
7. **Kaynak seed'i**: admin hesabı açıldıktan sonra
   `supabase/seed/0001_sources.sql`'i Supabase SQL Editor'de çalıştırın
   (Resmi Gazete RSS aktif; Sağlık Bakanlığı/HEP-SEN resmi sitesi pasif —
   `lib/sources/official-site.ts` adaptörünü gerçek sayfaya karşı test edip
   `sources.is_active`'i elle `true` yapın).

## Geliştirme

```bash
pnpm install                       # repo kökünden
pnpm --filter hepsen-web dev       # http://localhost:3010
pnpm --filter hepsen-web typecheck
pnpm --filter hepsen-web test      # Vitest birim testleri
pnpm --filter hepsen-web build && pnpm --filter hepsen-web test:e2e  # Playwright
```

## Kapsam (bu tur)

Faz 0 (doğrulama), Faz 1 (güvenli çekirdek: auth, PWA kabuğu, 5 panel, X
OAuth bağlama, audit log) ve Faz 2 (RSS/resmi-site/Apify toplama, gündem
kümeleme+puanlama, AI taslak üretimi, iki aşamalı hukuk guard, ton kontrolü,
zamanlama önerisi — `docs/adr/0005-*.md`). Taslakların onaylanması/reddi,
zamanlanmış yayın ve gerçek X paylaşımı Faz 3'te; öğrenme motoru Faz 4'te;
köşe yazısı Faz 5'te. Detay için repo kökü `IMPLEMENTATION_PLAN.md`.

## Arka plan işleri (Faz 2)

`vercel.json`'daki iki cron, `/api/internal/jobs/collect` (06:30 TR) ve
`/api/internal/jobs/generate-drafts`'i (07:40 TR) tetikler. Lokal test için:

```bash
curl -H "Authorization: Bearer $(grep CRON_SECRET .env.local | cut -d= -f2)" \
  http://localhost:3010/api/internal/jobs/collect
```

## PWA

Serwist (`src/app/sw.ts`) yalnızca `next build` (production) modunda aktif —
`next dev`'de service worker devre dışı bırakılır (Serwist config'i,
hızlı geliştirme deneyimi için). Kurulabilirliği test etmek için
`pnpm build && pnpm start` kullanın.
