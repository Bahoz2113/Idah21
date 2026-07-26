# hepsen-web

HEP-SEN Batman — Başkanlık İletişim OS'un web uygulaması (Faz 0+1: güvenli
çekirdek). İş mantığı `@hepsen/core`'dan (`packages/core`) gelir; bu paket
ağ/kimlik/UI'yi ekler.

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
   (veya `supabase.auth.admin.createUser`) manuel oluşturun — Faz 1'de
   public kayıt/invite akışı yok, tek yönetici hesabı varsayımı geçerli.

## Geliştirme

```bash
pnpm install                       # repo kökünden
pnpm --filter hepsen-web dev       # http://localhost:3010
pnpm --filter hepsen-web typecheck
pnpm --filter hepsen-web test      # Vitest birim testleri
pnpm --filter hepsen-web build && pnpm --filter hepsen-web test:e2e  # Playwright
```

## Kapsam (bu tur)

Yalnızca Faz 0 (doğrulama, bkz. `docs/adr/000{2,3,4}-*.md`) ve Faz 1 (güvenli
çekirdek: auth, PWA kabuğu, 5 panel, X OAuth bağlama, audit log). Gündem
toplama, AI taslak üretimi, gerçek X paylaşımı ve öğrenme motoru Faz 2-5'te.
Detay için repo kökü `IMPLEMENTATION_PLAN.md`.

## PWA

Serwist (`src/app/sw.ts`) yalnızca `next build` (production) modunda aktif —
`next dev`'de service worker devre dışı bırakılır (Serwist config'i,
hızlı geliştirme deneyimi için). Kurulabilirliği test etmek için
`pnpm build && pnpm start` kullanın.
