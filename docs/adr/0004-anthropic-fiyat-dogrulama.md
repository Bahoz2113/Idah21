# ADR 0004 — Anthropic model fiyatlarının doğrulanması

- **Tarih:** 2026-07-26
- **Durum:** Kabul edildi — `packages/core/src/config/pricing.ts` güncellendi.

## Bağlam
`DEFAULT_PRICING.anthropic` tahminiydi (`verifiedAt: null`). Faz 0 gereği
güncel Anthropic fiyatları araştırıldı (WebSearch; `anthropic.com/pricing`'e
doğrudan WebFetch bu ortamda 403 ile engellendi, birden fazla bağımsız 2026
tarihli ikincil kaynaktan çapraz doğrulandı).

## Bulgular

- **Claude Haiku 4.5:** $1.00 / MTok input, $5.00 / MTok output.
  → Mevcut placeholder (`input:1.0, output:5.0`) **zaten doğruymuş**, değişmedi.
- **Claude Sonnet 5:** standart fiyat $3.00 / MTok input, $15.00 / MTok output
  **ANCAK** 31 Ağustos 2026'ya kadar geçerli bir **giriş (intro) fiyatı** var:
  **$2.00 / MTok input, $10.00 / MTok output**. Bugünün tarihi (2026-07-26) bu
  aralığın içinde → şu an fiilen geçerli olan fiyat $2/$10'dur.
- **Prompt caching:** cache-read maliyeti, normal input fiyatının **%90 indirimli**
  hali (yani input fiyatının ~%10'u). Anthropic'in yayınlanmış standart
  mimarisiyle uyumlu olarak cache-write, input fiyatının **~1.25 katı**
  (mevcut placeholder'daki oranla birebir tutarlı: Haiku için 1.25 = 1.0×1.25,
  Sonnet için de aynı oran korunarak yeni baz fiyata uygulandı).
- **Batch API:** tüm modellerde **%50 indirim** (`batchMultiplier: 0.5`) —
  mevcut placeholder zaten doğruymuş, değişmedi.
- Claude Opus 4.8 (28 Mayıs 2026'da çıktı): $5.00/$25.00 — `pricing.ts`'de
  şu an tanımlı değil, HEPSEN bu modeli kullanmıyor, eklenmedi.

## Kod değişikliği
`packages/core/src/config/pricing.ts` → `DEFAULT_PRICING`:
```
verifiedAt: "2026-07-26"
anthropic.models["claude-haiku-4-5"]  → değişmedi (zaten doğruydu)
anthropic.models["claude-sonnet-5"]   → input 3.0→2.0, output 15.0→10.0,
                                          cacheRead 0.3→0.2, cacheWrite 3.75→2.5
                                          (intro fiyat, 2026-08-31'e kadar geçerli)
```
**Önemli — gelecekteki bakım notu:** Sonnet 5 intro fiyatı 31 Ağustos 2026'da
sona eriyor ve standart fiyata ($3/$15, cacheRead 0.3, cacheWrite 3.75)
dönecek. Bu tarihten sonra `pricing.ts` tekrar güncellenmeli ve `verifiedAt`
yenilenmeli — aksi halde bütçe guard'ı maliyeti olduğundan düşük hesaplar.

## Kaynaklar
- [Anthropic API Pricing in 2026: Complete Guide — finout.io](https://www.finout.io/blog/anthropic-api-pricing)
- [Anthropic Claude API Pricing In 2026 — CloudZero](https://www.cloudzero.com/blog/claude-api-pricing/)
- [Claude API Pricing 2026: Opus 4.8, Sonnet 4.6, Haiku 4.5 Costs — MetaCTO](https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration)
- [Claude API Pricing (July 2026) — BenchLM.ai](https://benchlm.ai/anthropic/api-pricing)

## Blocker / yeniden doğrulama gereği
`anthropic.com/pricing`'e doğrudan erişim bu ortamda engellendi; rakamlar
ikincil kaynaklardan çapraz doğrulandı. Gerçek `ANTHROPIC_API_KEY` ile ilk
faturalama döneminden sonra console.anthropic.com üzerinden teyit edilmeli,
özellikle 2026-08-31 sonrası Sonnet 5 fiyat değişimi için.
