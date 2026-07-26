# IMPLEMENTATION_PLAN.md — HEP-SEN Batman (Faz 0 + Faz 1 + Faz 2 + Faz 3)

Master prompt: `HEPSEN_Batman_Baskanlik_Iletisim_OS_Claude_Code_Master_Prompt.pdf`
(kullanıcı tarafından sağlandı, repo köküne eklenmedi — kaynak PDF harici).
Bu dosya master prompt md. 30 "Her faz öncesi kısa IMPLEMENTATION_PLAN.md
oluştur" kuralı gereği yazıldı.

## Kapsam

Bu tur **Faz 0 (Keşif/doğrulama), Faz 1 (Güvenli çekirdek), Faz 2 (Gündem ve
taslak üretimi) ve Faz 3 (Onay ve yayın)**'nı kapsar. Faz 4 (öğrenme/analiz),
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

## Faz 2 — Gündem ve taslak üretimi (TAMAMLANDI)

1. **`packages/core` boşluk giderme**: eksik `prompts/topic-scoring.ts` ve
   `prompts/tone-review.ts` eklendi (şemaları zaten vardı). 72/72 test.
2. **Şema**: `0003_extend_topics_and_sources.sql` (topics'e rights_impact/
   discussion_potential skorları, sources'a unique kısıt) uygulandı.
   `supabase/seed/0001_sources.sql` — admin hesabı açıldıktan sonra
   kullanıcının çalıştıracağı kaynak seed'i (Resmi Gazete aktif; Sağlık
   Bakanlığı/HEP-SEN resmi sitesi pasif, HTML yapısı doğrulanamadı).
3. **`lib/sources/`**: RSS (RSS 2.0 + Atom) ve genel official-site
   adaptörleri + Apify client (kod hazır, token yokken sessizce atlanır).
4. **`lib/topics/`**: deterministik ön-sinyaller (trend, hukuki risk cezası)
   + benzerlik tabanlı gündem kümeleme.
5. **`lib/ai/`**: provider-independent LLM Gateway (yalnızca Anthropic
   uygulandı, OpenAI/Gemini açıkça "uygulanmadı"), iki katmanlı prompt
   caching, Zod doğrulama + tek retry.
6. **`lib/drafts/generate-draft.ts`**: taslak üretim sırasının tam
   orkestrasyonu (md. 11) — iki aşamalı hukuk guard, ton kontrolü, hashtag,
   zamanlama, durum atama.
7. **Jobs**: `/api/internal/jobs/{collect,generate-drafts}` (Vercel Cron,
   GET+POST, CRON_SECRET korumalı) — `apps/hepsen-web/vercel.json`.
8. **Paneller**: Bugün ve Taslaklar artık gerçek veri gösteriyor (salt-okur;
   onay/red Faz 3'te).
9. Detaylı kararlar: `docs/adr/0005-faz2-gundem-ve-taslak-uretimi.md`.

## Faz 3 — Onay ve yayın (TAMAMLANDI)

1. **Şema**: `0004_publish_flow.sql` — `app_settings` (acil durdurma
   anahtarı) + `publications` üzerinde performans indexi.
2. **`packages/core`**: `buildDraftPostTask`'a additive `regenerationHint`
   alanı (75/75 test).
3. **`lib/drafts/generate-draft.ts`**: ortak üretim pipeline'ı
   (`runProductionPipeline`) çıkarıldı; **`regenerate-draft.ts`** aynı
   satırı günceller (version++), `regenerate-hints.ts` — master prompt'un
   6 sabit ikincil-menü ifadesi.
4. **`lib/x/`**: `client.ts`'e gerçek `postTweet()`; yeni
   `token-manager.ts` — süresi dolan token'ı otomatik yeniler+DB'ye yazar.
5. **API**: `/api/drafts/[id]/{approve,reject,schedule,edit,regenerate}` —
   form-tabanlı (JS'siz), `transition()`/`DraftStateError`→409,
   `draft_feedback` kaydı, audit log. Manuel düzenlemede risk yalnızca
   kötüleşebilir (bilinçli sınırlama, ADR 0006).
6. **`lib/jobs/publish-due-drafts.ts`** + `/api/internal/jobs/publish`
   (saatlik cron): acil durdurma kontrolü, `publishGate()` (onay+hash
   tekrar doğrulama), gerçek X paylaşımı, sınırlı retry (`attempt_count<3`).
7. **Paneller**: Taslaklar'a Onayla/Reddet/Zamanla/Düzenle/Yeniden-üret
   butonları; Takvim gerçek zamanlanmış taslakları gösteriyor; Ayarlar'a
   Acil Durdurma kartı.
8. Detaylı kararlar: `docs/adr/0006-faz3-onay-ve-yayin.md`.

## Bilinen sınırlamalar / sonraki adım

- `SUPABASE_SERVICE_ROLE_KEY` ve `DATABASE_URL` MCP üzerinden alınamaz
  (kasıtlı güvenlik kısıtı) — kullanıcı bunları Supabase Dashboard'dan alıp
  `apps/hepsen-web/.env.local`'e kendisi girmeli.
- Tek yönetici hesabı Supabase Auth'ta henüz oluşturulmadı (kullanıcı
  Dashboard'dan veya `supabase.auth.admin.createUser` ile kendisi açmalı) —
  bu olmadan kaynak seed'i de çalıştırılamaz.
- Apify token yok — kod hazır ama canlı bağlanmadı.
- Sağlık Bakanlığı/HEP-SEN resmi-site adaptörü gerçek sayfaya karşı
  doğrulanmadı (WebFetch bu ortamda engellendi) — kullanıcı test edip
  aktifleştirmeli.
- Gerçek AI taslak üretimi ve gerçek X yayını (ANTHROPIC_API_KEY / X hesabı
  ile) canlı denenmedi, yalnızca mock'lu test edildi — kullanıcı kendi
  ortamında ilk denemeyi yapmalı.
- `drafts.PUBLISHING` durumunda process crash olursa otomatik kurtarma yok
  (bilinçli, tek-admin/saatlik-cron ölçeği için kabul edilebilir — ADR 0006).
- Rate limit in-memory (tek instance); ölçeklenirse Redis'e taşınmalı.
- `FINAL_AUDIT.md` bu turda YAZILMADI — sistem tamamlanmadı (master prompt
  md. 30: "İş tamamlandığında FINAL_AUDIT.md oluştur").
