# IMPLEMENTATION_PLAN.md — HEP-SEN Batman (Faz 0 + Faz 1)

Master prompt: `HEPSEN_Batman_Baskanlik_Iletisim_OS_Claude_Code_Master_Prompt.pdf`
(kullanıcı tarafından sağlandı, repo köküne eklenmedi — kaynak PDF harici).
Bu dosya master prompt md. 30 "Her faz öncesi kısa IMPLEMENTATION_PLAN.md
oluştur" kuralı gereği yazıldı.

## Kapsam

Bu tur **yalnızca Faz 0 (Keşif/doğrulama) ve Faz 1 (Güvenli çekirdek)**'i
kapsar. Faz 2 (gündem/taslak), Faz 3 (onay/yayın), Faz 4 (öğrenme/analiz),
Faz 5 (köşe yazısı) bilinçli olarak bu turda YOK.

Konum: bu monorepoda (`Bahoz2113/Idah21`, CEZERİ ROBOTECH Education OS ile
aynı repo, farklı ürün) izole `apps/hepsen-web` paketi. CEZERİ koduna hiç
dokunulmadı.

## Faz 0 — Keşif ve doğrulama (TAMAMLANDI)

| Doğrulama | ADR |
|---|---|
| X API fiyat + OAuth 2.0 PKCE | `docs/adr/0002-x-api-pricing-oauth.md` |
| Apify actor karşılaştırması | `docs/adr/0003-apify-actor-secimi.md` |
| Anthropic model fiyatları | `docs/adr/0004-anthropic-fiyat-dogrulama.md` |

`packages/core/src/config/pricing.ts` doğrulanan değerlerle güncellendi
(`verifiedAt: "2026-07-26"`), 62/62 test hâlâ geçiyor.

## Faz 1 — Güvenli çekirdek (TAMAMLANDI)

1. **Supabase**: `hepsen-batman` adında yeni, CEZERİ'den bağımsız proje
   (`eu-central-1`) oluşturuldu; `supabase/migrations/0001_init.sql` (şema,
   RLS, audit immutability) ve `0002_harden_audit_function_search_path.sql`
   (güvenlik advisor düzeltmesi) uygulandı. 19 tablo, RLS hepsinde aktif,
   güvenlik lint'i temiz.
2. **`apps/hepsen-web`**: Next.js App Router + TypeScript + Tailwind, `@hepsen/core`
   `workspace:*` bağımlılığı ile eklendi.
3. **Auth**: Supabase Auth, tek yönetici hesabı (email+password), middleware
   route guard.
4. **PWA**: Serwist (`src/app/sw.ts`) — yalnızca statik kabuk cache'lenir,
   `/api/*` her zaman network-only.
5. **5 panel**: Bugün (gerçek `@hepsen/core` bütçe entegrasyonu), Taslaklar/
   Takvim/Analiz (Faz 2-4 placeholder), Ayarlar (X bağlama/kaldırma).
6. **X OAuth 2.0 PKCE**: `/api/auth/x/{connect,callback,disconnect}` —
   AES-256-GCM token şifreleme, audit log, best-effort token revoke.
7. **Güvenlik**: Zod tabanlı `lib/env.ts` fail-fast validasyon, CSP/HSTS
   header'ları, `/api/auth/x/connect` üzerinde rate limit.
8. **Testler**: Vitest (env, token-cipher, PKCE, rate-limit) + Playwright
   smoke (login sayfası, auth guard, health endpoint).

## Bilinen sınırlamalar / sonraki adım

- `SUPABASE_SERVICE_ROLE_KEY` ve `DATABASE_URL` MCP üzerinden alınamaz
  (kasıtlı güvenlik kısıtı) — kullanıcı bunları Supabase Dashboard'dan alıp
  `apps/hepsen-web/.env.local`'e kendisi girmeli.
- Tek yönetici hesabı Supabase Auth'ta henüz oluşturulmadı (kullanıcı
  Dashboard'dan veya `supabase.auth.admin.createUser` ile kendisi açmalı).
- Apify/gerçek X paylaşımı/AI taslak üretimi Faz 2-3 kapsamında.
- Rate limit in-memory (tek instance); ölçeklenirse Redis'e taşınmalı.
- `FINAL_AUDIT.md` bu turda YAZILMADI — sistem tamamlanmadı (master prompt
  md. 30: "İş tamamlandığında FINAL_AUDIT.md oluştur").
