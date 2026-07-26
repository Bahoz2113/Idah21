# HEP-SEN Batman — X (Twitter) Entegrasyonu (Faz 1: bağlama akışı)

Kaynak: `docs/adr/0002-x-api-pricing-oauth.md`.

## OAuth 2.0 Authorization Code + PKCE

1. Kullanıcı Ayarlar panelinde "X hesabını bağla"ya tıklar → `GET /api/auth/x/connect`.
2. Sunucu PKCE `code_verifier`/`code_challenge` (S256) ve CSRF `state` üretir,
   10 dakikalık httpOnly cookie'de saklar, kullanıcıyı
   `https://x.com/i/oauth2/authorize`'a yönlendirir.
   Scope: `tweet.read tweet.write users.read offline.access`.
3. X kullanıcıyı `X_REDIRECT_URI` → `GET /api/auth/x/callback`'e geri
   yönlendirir. `state` cookie ile eşleşmezse bağlama reddedilir ve
   `audit_logs`'a `x_connect_failed` yazılır.
4. Sunucu `code`'u `code_verifier` ile birlikte
   `POST https://api.x.com/2/oauth2/token`'a gönderip access+refresh token
   alır (refresh token yalnızca `offline.access` verildiyse gelir; gelmezse
   akış hata olarak ele alınır).
5. `GET https://api.x.com/2/users/me` ile X kullanıcı adı/ID'si alınır.
6. Token'lar AES-256-GCM ile şifrelenip `x_accounts` tablosuna yazılır
   (`access_token_encrypted`, `refresh_token_encrypted` — bytea, PostgREST
   `\x<hex>` biçiminde). `audit_logs`'a `x_connect_succeeded` yazılır
   (token değeri asla loglanmaz).

## Bağlantıyı kaldırma

`POST /api/auth/x/disconnect`: mevcut access token'ı deşifre edip
`POST https://api.x.com/2/oauth2/revoke`'a best-effort gönderir (X tarafında
başarısız olsa bile yerel bağlantı kaldırılır), `x_accounts.revoked_at` set
edilir (satır silinmez), `audit_logs`'a `x_disconnect` yazılır.

## Token yaşam döngüsü (Faz 2+'da otomatikleştirilecek)

Access token 2 saat, refresh token 6 ay geçerli (X dokümantasyonu — bkz.
ADR 0002). Faz 1'de otomatik yenileme job'ı YOK; `lib/x/oauth.ts` içindeki
`refreshAccessToken()` hazır ama henüz bir cron/job tarafından çağrılmıyor.
Bu, Faz 2'nin arka plan işleri (master prompt md. 25) kapsamına giriyor.

## Fiyatlandırma

Bkz. `docs/adr/0002-x-api-pricing-oauth.md` ve
`packages/core/src/config/pricing.ts` (`DEFAULT_PRICING.xApi`).
