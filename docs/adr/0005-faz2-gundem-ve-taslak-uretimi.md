# ADR 0005 — Faz 2: Gündem ve taslak üretimi mimari kararları

- **Tarih:** 2026-07-26
- **Durum:** Kabul edildi, uygulandı.

## Bağlam

Faz 0+1 tamamlandıktan sonra master prompt'un Faz 2'si (RSS/resmi kaynak/
Apify toplama, gündem puanlama, AI taslak üretimi, hukuk/ton/anti-AI guard)
uygulandı. Bu ADR, uygulama sırasında alınan ve kullanıcıyla netleştirilen
mimari kararları kaydeder.

## 1. `packages/core`'da bulunan boşluk

`types/schemas.ts` içinde `TopicScoringOutput` ve `ToneReviewOutput` şemaları
tanımlıydı ama karşılık gelen `prompts/topic-scoring.ts` ve
`prompts/tone-review.ts` builder'ları yoktu. Mevcut desene (versioned prompt
sabiti + `buildXTask()` + JSON şema) sadık kalınarak eklendi, `packages/core`
72/72 testle (10 yeni) doğrulandı. Mevcut hiçbir dosya değiştirilmedi.

## 2. Şema genişletmesi (additive)

`scoring/topic.ts`'in `TopicSignals`'ı `rightsImpact` ve
`discussionPotential` bekliyordu ama `topics` tablosunda (ve master prompt'un
kendi şema listesinde) bu iki kolon yoktu. `0003_extend_topics_and_sources.sql`
ile `topics.rights_impact_score`/`discussion_potential_score` eklendi ve
`sources`'a `(user_id, url_or_query)` unique kısıtı kondu (idempotent seed
için). Hiçbir mevcut kolon/satır değişmedi.

## 3. Kaynak seed'i migration DEĞİL, ayrı script

`sources.user_id` NOT NULL + `users(id)` referansı olduğu için (tek yönetici
hesabı varsayımı), gerçek admin hesabı açılmadan kaynak satırı eklenemez.
Bu yüzden seed, `supabase/migrations/`'da değil `supabase/seed/0001_sources.sql`
içinde — kullanıcı admin hesabını açtıktan sonra kendisi çalıştıracak
(README'de adım adım anlatıldı).

## 4. Doğrulanan vs. doğrulanamayan kaynaklar

- **Resmi Gazete RSS** (`resmigazete.gov.tr/rss`): WebSearch ile gerçek ve
  aktif olduğu doğrulandı → `is_active=true` seed edilecek.
- **Sağlık Bakanlığı duyuru sayfası** ve **HEP-SEN resmi sitesi**
  (`hepsen.org.tr/duyurular` — gerçekten var): URL'ler doğrulandı ama HTML
  yapısı bu ortamda WebFetch engellendiği için (403, tüm dış siteler için)
  canlı test edilemedi. Bu yüzden site-özel CSS-selector'lı bir scraper
  YAZILMADI; bunun yerine `lib/sources/official-site.ts` tüm sayfayı düz
  metne çeviren GENEL bir adapter. Bu iki kaynak `is_active=false` seed
  edilecek — kullanıcı gerçek sayfaya karşı test edip aktifleştirmeli.

## 5. Apify: kod yazıldı, bağlanmadı

`lib/sources/apify.ts` ADR 0003'teki actor mantığıyla (run-sync-get-dataset-
items ucu) yazıldı, mock'lu testlerle doğrulandı. `APIFY_API_TOKEN` boşken
`collectFromApify()` sessizce boş dizi döner — collect job'ını bozmaz. Gerçek
bağlantı kullanıcı token sağladığında otomatik aktifleşir.

## 6. LLM Gateway: SDK değil, ham fetch

`@anthropic-ai/sdk`'nin kurulu sürümünde (`0.32.1`) `cache_control` yalnızca
beta ad alanında (`client.beta.promptCaching.messages`) destekleniyor. Sürüm
bağımsız ve mock'lanması daha kolay olduğu için SDK eklenmedi; ham `fetch`
ile `https://api.anthropic.com/v1/messages`'a gidiliyor, iki katmanlı
`cache_control: ephemeral` (SYSTEM_POLICY + presidentialContext) manuel
uygulanıyor. `LLM_PROVIDER=openai/gemini` için mock DEĞİL, açık "henüz
uygulanmadı" hatası (master prompt md. 35).

## 7. Cron basitleştirme

Master prompt'un 4 ayrı saatini (06:30 RSS/resmi, 07:00 Apify, 07:20 dedup/
scoring, 07:40 taslak) **iki** cron'a indirdik: `collect` (03:30 UTC =
06:30 Europe/Istanbul, tüm aktif kaynaklar — Apify token yoksa sessizce
atlanır) ve `generate-drafts` (04:40 UTC = 07:40 Europe/Istanbul, dedup+
kümeleme+puanlama+üretim tek job'da). Apify henüz bağlı olmadığı için ayrı
cron'un şu an değeri yok; Apify canlıya alındığında ayrı bir job'a
bölünebilir. Türkiye DST uygulamadığından (sabit UTC+3) saat hesapları
zamanla kaymaz. `apps/hepsen-web/vercel.json` — kök `vercel.json`
(`apps/web`/CEZERİ'ye ait) ile karıştırılmamalı, ayrı proje-yerel dosya.

## 8. Konu kümeleme

DB şeması `topic_sources` ile çoklu-kaynaklı konuları destekliyor ama
kümeleme mantığı tanımsızdı. `lib/topics/cluster.ts`, `@hepsen/core`'un
`similarity()` fonksiyonuyla (Jaccard, eşik 0.35) aynı gündemi anlatan farklı
kaynaklı içerikleri tek kümede toplar — `distinctSourceCount` tek-kaynaklı
ağır iddia kuralı için buradan hesaplanır.

## 9. Deterministik ön-sinyaller

`sourceReliability` (DB'den), `trendStrength` (yenilik bazlı, `lib/topics/
signals.ts:computeTrendStrength`) ve `legalRiskPenalty` (`runBlocklist()`
sonucundan, `blocklistPenalty()`) LLM'e SORULMAZ — yalnızca semantik
değerlendirme gerektiren sinyaller (healthRelevance, urgency, rightsImpact,
batmanRelevance, discussionPotential, isHeavyAllegation) LLM'den istenir.

## 10. Test stratejisi

Route handler'ların (`api/internal/jobs/*`) kendisi ayrı test edilmedi —
Faz 1'deki X OAuth route'larıyla aynı emsal: route'lar zaten tekil test
edilmiş saf fonksiyonları (`collectFromSource`, `generateDraftForTopic`,
`clusterItems`, `computeTrendStrength`, `runStructured`) çağıran ince
orkestrasyon katmanı. Tüm ağ çağrıları (`fetch`) mock'landı — gerçek network
isteği hiçbir testte yok. Toplam: `@hepsen/core` 72/72, `hepsen-web` 50/50.

## Kapsam dışı (bilinçli, Faz 3+)

Onay/red/düzenleme UI ve API'leri, taslak durum makinesinin geçiş
endpoint'leri, gerçek X paylaşımı, zamanlanmış yayın, öğrenme/analiz,
haftalık köşe yazısı.
