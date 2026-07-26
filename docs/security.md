# HEP-SEN Batman — Güvenlik (Faz 0+1)

## Uygulanan kontroller

| Kontrol | Nerede |
|---|---|
| Server-only env doğrulama (fail-fast) | `apps/hepsen-web/src/lib/env.ts` (Zod) |
| RLS her tabloda aktif + zorunlu (`force row level security`) | `supabase/migrations/0001_init.sql` |
| Audit log değiştirilemez/silinemez (trigger) | `0001_init.sql` + `0002_harden_audit_function_search_path.sql` |
| X access/refresh token AES-256-GCM şifreli, DB'de düz metin yok | `lib/crypto/token-cipher.ts` |
| Şifreli token kolonları `authenticated` rolünden gizli | `revoke select (...) on x_accounts from authenticated` |
| OAuth state + PKCE verifier httpOnly/secure/sameSite=lax, 10 dk TTL | `api/auth/x/connect/route.ts` |
| X şifresi hiçbir zaman istenmez/saklanmaz | OAuth 2.0 Authorization Code + PKCE (parola akışı yok) |
| CSP, HSTS, X-Frame-Options, Permissions-Policy | `next.config.js` `headers()` |
| Rate limit (`/api/auth/x/connect`) | `lib/rate-limit.ts` |
| Audit log yalnızca service-role yazabilir, kullanıcı yalnızca kendi kaydını okur | RLS policy `audit_read_own` |
| Hata mesajlarında/loglarda token asla görünmez | `callback`/`disconnect` route'larında catch bloklarında ham hata gövdesi loglanmıyor |

## Bilinen sınırlamalar (Faz 1 sonunda)

- **Rate limit in-memory**: tek Next.js instance'ı için yeterli; yatay
  ölçeklenirse (birden fazla instance) Upstash Redis gibi paylaşımlı bir
  depoya taşınmalı.
- **CSRF**: Next.js Server Action'ları kullanılmadığı için (route handler +
  form POST) ayrı bir CSRF token'ı bu turda eklenmedi; OAuth `state`
  parametresi zaten OAuth akışını CSRF'e karşı korur. Disconnect formu aynı
  origin'den POST edildiği için `sameSite=lax` cookie'ler ek koruma sağlar.
  Faz 2+'da yazma işlemleri artarsa özel bir CSRF token'ı değerlendirilmeli.
- **Dependency audit / secret scanning / SAST**: CI pipeline'ı bu repoda
  henüz kurulu değil (`.github/workflows` yok) — bu turun kapsamı dışında,
  ayrı bir istek gerektirir.
- **Service role key / DATABASE_URL**: Supabase MCP bu sırları döndürmez
  (kasıtlı). Kullanıcı bunları Dashboard'dan alıp yalnızca
  `apps/hepsen-web/.env.local` (gitignore'lu) içine koymalı.

## Değişmez kurallar (asla gevşetilmez)

NO APPROVAL = NO PUBLICATION. X şifresi asla istenmez. Secret'lar loglanmaz/
commit edilmez. Audit log silinemez/değiştirilemez. Toplanan harici metin
(Faz 2+) her zaman "güvenilmeyen veri" olarak işlenir, LLM sistem promptundan
ayrı tutulur (bkz. `packages/core/src/prompts/`).
