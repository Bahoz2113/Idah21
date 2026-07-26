# ADR 0002 — X API fiyatlandırma ve OAuth 2.0 PKCE doğrulaması

- **Tarih:** 2026-07-26
- **Durum:** Kabul edildi (WebSearch ile çapraz doğrulandı; WebFetch bu ortamda
  `developer.x.com`/`docs.x.com`'a doğrudan erişemedi — HTTP 403, muhtemelen bot
  engelleme. Rakamlar birden fazla bağımsız ikincil kaynaktan (2026 tarihli)
  çapraz doğrulandı, ama resmi konsoldan (giriş yapılmış hesapla) periyodik
  olarak yeniden teyit edilmeli.)

## Bağlam
`packages/core/src/config/pricing.ts` içindeki X API fiyatları tahminiydi
(`verifiedAt: null`). Faz 0 gereği güncel resmi fiyat/OAuth bilgisi araştırıldı.

## Bulgular

### Fiyatlandırma (6 Şubat 2026'dan itibaren geçerli model)
X, 6 Şubat 2026'da varsayılan modeli **pay-per-use**'a çevirdi; yeni geliştiriciler
için Basic/Pro'ya kayıt seçeneği artık yok:
- **Post oluşturma (link yok):** $0.015 / post
- **Post oluşturma (link var):** $0.20 / post
- **Post okuma:** $0.005 / post, aylık 2 milyon okuma tavanı
- **Legacy Basic** (yalnızca mevcut aboneler): $200/ay, ~50.000 yazma, ~10-15.000
  okuma/ay, 7 günlük arama, streaming yok.
- **Legacy Pro** (yalnızca mevcut aboneler): $5.000/ay, 1.000.000 okuma, tam arşiv
  arama, filtered/sampled stream.
- **Enterprise:** ~$42.000/ay'dan başlıyor.
- **Ücretsiz tier:** Şubat 2026'dan sonra yeni geliştiricilere kapalı; mevcut
  ücretsiz kullanıcılara tek seferlik $10 kredi verildi.

### OAuth 2.0 Authorization Code Flow with PKCE
- Authorize endpoint: `https://x.com/i/oauth2/authorize`
- Token endpoint: `POST https://api.x.com/2/oauth2/token`
- Scope'lar (master prompt ile birebir uyumlu): `tweet.read`, `tweet.write`,
  `users.read`, `offline.access` (refresh token almak için zorunlu).
- `offline.access` verilmezse refresh token üretilmez, access token yalnızca
  **2 saat** geçerli olur. `offline.access` ile refresh token **6 ay** geçerli.
- PKCE zorunlu (Authorization Code flow'un tek desteklenen biçimi bu).

## Kod etkisi
`packages/core/src/config/pricing.ts` → `DEFAULT_PRICING.xApi`:
- `postCreateNoLink: 0.015` ve `postCreateWithLink: 0.2` **zaten doğruydu**,
  değişmedi.
- `replyCreate`: X API yanıt (reply) yazımını ayrı fiyatlandırmıyor gibi
  görünüyor (bir post write olarak sayılıyor) → `postCreateNoLink` ile aynı
  (0.015) bırakıldı, bu bir **varsayımdır**, resmi dokümantasyonda ayrı reply
  fiyatı bulunamadı.
- `readOwnPost`/`readThirdPartyPost`: Önceki tahmin "kendi postunu okumak" için
  ayrı ve daha düşük bir ücret (0.001) varsayıyordu. Bulunan kaynaklarda böyle
  bir ayrım YOK — tek bir okuma fiyatı ($0.005) var. Bu nedenle her ikisi de
  **0.005**'e eşitlendi (bütçeyi olduğundan düşük göstermemek için muhafazakâr
  yönde düzeltme).
- `apps/hepsen-web/lib/x/oauth.ts` (Faz 1) bu ADR'deki endpoint/scope
  bilgilerini kullanacak; `X_REDIRECT_URI` env'den okunacak, refresh token
  6 aylık geçerlilik varsayımıyla yenileme job'ı zamanlanacak (Faz 1'de sadece
  ilk bağlama akışı var, otomatik refresh job'ı Faz 2+'da).

## Kaynaklar
- [X (Twitter) API Pricing in 2026: All Tiers | Postproxy](https://postproxy.dev/blog/x-api-pricing-2026/)
- [X (Twitter) API Pricing: Complete Guide for 2026 - Blotato](https://www.blotato.com/blog/twitter-api-pricing)
- [Twitter/X API Pricing 2026: All Tiers ($0 to $42K) Compared - xpoz.ai](https://www.xpoz.ai/blog/guides/understanding-twitter-api-pricing-tiers-and-alternatives/)
- [OAuth 2.0 Authorization Code Flow with PKCE - X (docs.x.com)](https://docs.x.com/fundamentals/authentication/oauth-2-0/authorization-code)
- [OAuth 2.0 Authorization Code Flow with PKCE | Twitter Developer Platform](https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code)

## Blocker / yeniden doğrulama gereği
Bu rakamlar, X'in resmi konsoluna (developer.x.com, giriş gerektirir) bu ortamda
erişilemediği için ikincil kaynaklardan derlendi. **Gerçek X Developer App
oluşturulduğunda, konsoldaki güncel fiyat/limit sayfası kullanıcı tarafından
tekrar teyit edilmeli.**
