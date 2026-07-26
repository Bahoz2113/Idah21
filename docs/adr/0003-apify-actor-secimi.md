# ADR 0003 — Apify X/Twitter scraping actor seçimi (araştırma)

- **Tarih:** 2026-07-26
- **Durum:** Araştırma tamamlandı — **seçim ertelendi** (Faz 2 kapsamı).
  Kullanıcının Apify hesabı/token'ı henüz yok, bu turda (Faz 0+1) gerçek
  bağlanma yapılmıyor.

## Bağlam
Master prompt Faz 0'da "Apify Actor seçeneklerini fiyat ve çıktı şeması
açısından karşılaştır" istiyor. Bu ADR yalnızca karşılaştırmayı kayda geçirir;
gerçek entegrasyon (`APIFY_API_TOKEN`, `APIFY_X_ACTOR_ID`) Faz 2'de yapılacak.

## Karşılaştırılan adaylar (Apify Store, WebSearch ile bulundu)

| Actor | Fiyat | Not |
|---|---|---|
| `igolaizola/x-twitter-scraper-ppe` | $0.15 / 1000 sonuç | En ucuz adaylardan |
| `xquik/x-tweet-scraper` | $0.15 / 1000 tweet | Pay-per-result |
| `kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest` | $0.25 / 1000 tweet | Mevcut `pricing.ts` varsayımıyla (0.25) birebir eşleşiyor |
| `apidojo/tweet-scraper` (Tweet Scraper V2) | $0.40 / 1000 tweet | Apify Store'da en popüler/en çok kullanılan X scraper'lardan biri; daha zengin çıktı şeması iddia ediliyor |
| `cryptosignals/twitter-scraper` | Belirtilmemiş | API key gerektirmiyor |
| `altimis/scweet` | Belirtilmemiş | Arama + profil kazıma |

Genel aralık: **$0.15–$0.40 / 1000 sonuç**, aylık minimum ücret yok (pay-per-result).

## Ön değerlendirme (nihai karar Faz 2'de)
- Bütçe kısıtı sert: `packages/core` `DEFAULT_BUDGET.perProvider.apify = 2.85 USD/ay`.
  $0.15-0.25/1000 aralığındaki bir actor ile bu bütçeyle ayda ~11.000-19.000
  sonuç toplanabilir — HEP-SEN Batman'ın günlük 2-5 taslak hedefine göre fazlasıyla
  yeterli.
- **Ön eğilim:** `igolaizola/x-twitter-scraper-ppe` veya `xquik/x-tweet-scraper`
  ($0.15/1000) maliyet açısından en uygun; ancak çıktı şemasının (engagement
  metrikleri, yazar tipi, tarih alanları) `collected_items` tablosunun
  gerektirdiği alanlarla (title, content, url, author, author_handle,
  published_at, engagement_snapshot) tam eşleşip eşleşmediği Faz 2'de gerçek bir
  test çalıştırmasıyla doğrulanmalı — bu ADR sadece fiyat karşılaştırması, çıktı
  şeması testi değil.
- `apidojo/tweet-scraper` daha pahalı ama daha "kanıtlanmış"/popüler olması,
  güvenilirlik açısından yedek seçenek olarak not edildi.

## Kaynaklar
- [Cheapest Twitter Scraper | $0.25 per 1000 Tweets · Apify](https://apify.com/kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest/api)
- [X Twitter Scraper ($0.15 per 1000 results) · Apify](https://apify.com/igolaizola/x-twitter-scraper-ppe)
- [X Tweet Scraper | $0.15/1K Tweets · Apify](https://apify.com/xquik/x-tweet-scraper)
- [Tweet Scraper V2 - X / Twitter Scraper · Apify](https://apify.com/apidojo/tweet-scraper)
- [Best Twitter/X Scrapers on Apify (2026) - Use Apify](https://use-apify.com/docs/best-apify-actors/best-twitter-scrapers)

## Blocker / yeniden doğrulama gereği
`config/pricing.ts`'deki `apify.freeMonthlyCreditUsd: 5.0` alanı bu turda
**doğrulanamadı** (Apify'ın kendi fiyatlandırma sayfasına WebFetch erişimi bu
ortamda 403 ile engellendi). Bu alan `verifiedAt` güncellemesine DAHİL
EDİLMEDİ — gerçek Apify hesabı açıldığında console.apify.com üzerinden teyit
edilmeli.
