# HEP-SEN Batman — Bütçe Modeli (Faz 0+1 durumu)

## Master prompt varsayılanları (md. 22)

| Sınır | Tutar |
|---|---|
| Aylık bütçe | 20 USD |
| Yumuşak sınır | 16 USD (%80) |
| Uyarı sınırı | 18 USD (%90) |
| Kesin tavan | 20 USD (%100) |

## Neden `packages/core`'daki `DEFAULT_BUDGET` kullanılmıyor?

`packages/core/src/budget/guard.ts`'deki `DEFAULT_BUDGET` (`monthlyUsd: 5`,
`hardCeilingUsd: 8`) farklı bir varsayım seti — `@hepsen/core` DEĞİŞTİRİLMEDİ
(paket önceden testli ve hazır kabul edildi). Bunun yerine
`apps/hepsen-web/src/lib/budget-config.ts`, `evaluate()`'e geçirilecek
`BudgetConfig`'i env'den (`MONTHLY_BUDGET_USD`, varsayılan 20) master
prompt'un %80/%90/%100 oranlarıyla inşa ediyor.

## Sağlayıcı alt-bütçeleri (perProvider)

Master prompt sağlayıcı bazlı bir bölüşüm vermiyor. Faz 1'de şu **geçici**
oran kullanıldı (20 USD üzerinden, `MONTHLY_BUDGET_USD` değişirse orantılı
ölçeklenir):

| Sağlayıcı | Pay | Gerekçe |
|---|---|---|
| Anthropic | 14 USD | İçerik üretimi (Faz 2-3) asıl maliyet kalemi |
| Apify | 4 USD | ~16.000-26.000 tweet/ay toplama (bkz. ADR 0003) |
| X API | 2 USD | Yayın işlemleri bütçeden bağımsız rezervde (`PUBLISH_OPS`); bu pay yalnızca okuma/keşif için |

Bu oranlar tahminidir, Faz 2'de gerçek kullanım verisiyle yeniden
ayarlanmalı.

## Sert tavan istisnası

`evaluate()` içinde `publish`/`reply_publish` operasyonları bütçe dolsa bile
`allowed: true` döner (`PUBLISH_OPS` — "onaylı içeriğin yayını bütçe yüzünden
durmaz", sert tavan hariç). Bu davranış `packages/core`'da zaten var ve
değiştirilmedi.

## Faz 1'deki tek gerçek entegrasyon

"Bugün" paneli (`(panel)/today/page.tsx`) cari ayın `budget_usage` satırlarını
Supabase'den okuyup `evaluate()`'e geçiriyor — gösterge gerçek veriyle
çalışıyor, ama `budget_usage` tablosuna henüz kimse yazmıyor (yazma işlemi
Faz 2'de her dış servis çağrısıyla birlikte eklenecek), bu yüzden Faz 1'de
gösterge her zaman "%0, normal" gösterecektir.
