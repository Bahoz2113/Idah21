# ADR 0006 — Faz 3: Onay ve yayın akışı mimari kararları

- **Tarih:** 2026-07-26
- **Durum:** Kabul edildi, uygulandı.

## Bağlam

Faz 0-2 tamamlandıktan sonra master prompt'un Faz 3'ü (taslak durum makinesi
gerçek API'lere bağlanır; onay/düzenleme/ret/yeniden-üretim/zamanlama akışları
ve gerçek X yayın servisi) uygulandı. `@hepsen/core`'un `state/draft-machine.ts`
(`transition`, `publishGate`, `textHash`) zaten testli ve hazırdı — bu faz
onu gerçek API/job'lara bağladı.

## 1. Acil durdurma — yeni `app_settings` tablosu

`0004_publish_flow.sql`: `user_id` PK'li tek satır/kullanıcı tablosu (mevcut
"her satır user_id ile sahiplenir" deseniyle uyumlu). Ayarlar panelinde bir
toggle formu var; saatlik publish job'ı her çalıştığında bu bayrağı kontrol
eder ve `true` ise hiçbir yayın denemesi yapmadan erken döner.

## 2. Regenerate — ayrı fonksiyon, aynı satır güncellenir

`generate-draft.ts`'teki üretim-sonrası ortak adımlar (blocklist→legal-
review→ton→hook→hashtag→timing) `runProductionPipeline()` olarak çıkarıldı;
hem ilk üretim (`generateDraftForTopic`) hem yeniden üretim
(`regenerateDraft`) bunu kullanıyor — mantık tekrarlanmadı, davranış
değişmedi (mevcut testler aynen geçti).

`regenerateDraft()` **yeni satır açmaz**, mevcut `drafts` satırını
günceller (`version++`, `approved_text_hash: null`) — `draft_feedback`/
`publications` FK'leri `draftId`'ye bağlı olduğu için bu geçmişi korur.
`transition(draft.status, "edit")` PUBLISHING/PUBLISHED'ten çağrılırsa
`DraftStateError` fırlatır — yayınlanmış/yayınlanmakta olan bir taslak
yeniden üretilemez (test edildi).

**`packages/core`'a additive alan**: `buildDraftPostTask`'a opsiyonel
`regenerationHint?: string` eklendi. Verilmezse çıktı birebir aynı (75/75
test — 3 yeni test dahil). Master prompt'un 6 sabit ikincil-menü ifadesi
(`daha kararlı/kısa/doğal/kurumsal, riski azalt, hashtag değiştir`)
`lib/drafts/regenerate-hints.ts`'te Türkçe cümlelere eşlendi — UI metni
`@hepsen/core`'a sızmadı.

## 3. Manuel düzenleme: risk yalnızca kötüleşebilir

`/api/drafts/[id]/edit`: metin değiştiğinde LLM'e tekrar ödeme yapılmadan
yalnızca deterministik `runBlocklist` yeniden çalışır, `combineRisk` ile
mevcut risk seviyesiyle birleştirilir (max alır — **yalnızca kötüleşebilir**).
Riski **düşürmek** için tam pipeline'dan geçen `regenerate` kullanılmalı.
Bilinçli bir maliyet/güvenlik dengesi: sık küçük düzenlemelerde her seferinde
LLM hukuk taraması çalıştırmak hem pahalı hem de "birkaç kelime değiştirip
riski atlatma" riskine açık olurdu.

## 4. Form-tabanlı API (JS'siz), `PATCH` yerine `POST .../edit`

Faz 1'de kurulan "sade PWA, JS'siz form" deseni (X bağlama/kaldırma) burada
da sürdürüldü — tarayıcı formları `PATCH` desteklemediği için düzenleme
`POST /api/drafts/[id]/edit` olarak yapıldı. Tüm aksiyonlar (`approve`,
`reject`, `schedule`, `regenerate`, `edit`) düz `<form method="post">` ile
çalışıyor, `Taslaklar` panelinde `<details>` ile "Düzenle"/"Yeniden üret"
bölümleri katlanabilir.

## 5. `/api/internal/jobs/publish` — publishGate SCHEDULED durumunda çağrılır

State machine `PUBLISHING`'den geri `REVIEW_REQUIRED`'a dönüş tanımlamıyor
(`PUBLISHING: { publish_success, publish_fail }` — ikisi de ileri gider).
Bu yüzden `publishGate()` taslak **hâlâ SCHEDULED durumundayken** çağrılır;
`revokeApproval: true` dönerse (metin onaydan sonra değişmiş veya risk
yükselmiş) taslak `transition(status, "edit")` ile `REVIEW_REQUIRED`'a
düşürülür ve ilgili `publications` satırı `cancelled` işaretlenir — yeniden
onay gerekir. Gate geçerse `start_publish`→`PUBLISHING`, gerçek
`postTweet()` çağrısı, başarı/başarısızlığa göre `publish_success`/
`publish_fail`. **Sınırlı retry**: `attempt_count < 3`, 3. denemede
`publications.status: 'failed'` (kalıcı) — master prompt'un "sınırlı retry
ve kullanıcıya açık hata mesajı" kuralı.

**Bilinen sınırlama**: taslak `PUBLISHING`'de kilitli kalırsa (process
crash) otomatik kurtarma job'ı yok — tek-admin/saatlik-cron ölçeği için
kabul edilebilir bulundu, Faz 4+'da izlenebilir/genişletilebilir.

## 6. Token yönetimi ayrı katman

`lib/x/oauth.ts` yalnızca OAuth uç noktalarını (exchange/refresh/revoke)
barındırıyordu; `lib/x/client.ts`'e gerçek X kaynak çağrısı (`postTweet`)
eklendi. Token'ın süresi dolmadan otomatik yenilenmesi ve DB'ye yeniden
şifrelenerek yazılması için **yeni** `lib/x/token-manager.ts` eklendi — bu
ikisini birleştiren orkestrasyon katmanı, ileride "metrik çekme" gibi diğer
authenticated X çağrıları da bunu kullanacak.

## 7. Test stratejisi (değişmedi, Faz 1-2 emsali)

Route handler'ların kendisi ayrı test edilmedi — ince sarmalayıcılar,
altlarındaki saf fonksiyonlar (`publishDueDrafts`, `regenerateDraft`,
`postTweet`, `ensureFreshAccessToken`) tekil test edildi. Tüm ağ çağrıları
mock'landı. Yeni: 3 (`draft-post` core) + 10 (`x/publish`,
`x/token-manager`) + 4 (`regenerate-draft`) + 5 (`publish-due-drafts`) = 22
yeni test. Toplam: `@hepsen/core` 75/75, `hepsen-web` 65/65.

## Kapsam dışı (bilinçli)

Gerçek X hesabının canlı bağlanması ve gerçek yayının denenmesi (hesap bağlı
değil — kullanıcı kendi ortamında yapacak), öğrenme/analiz (Faz 4), haftalık
köşe yazısı (Faz 5), `FINAL_AUDIT.md` (sistem tamamlanmadı).
