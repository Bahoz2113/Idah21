# HEP-SEN Batman — İçerik Politikası (Faz 0+1 durumu)

Bu politika şu an **kodda uygulanmış** (`@hepsen/core`) ama **arayüzden henüz
çağrılmıyor** — taslak üretimi Faz 2'de eklendiğinde
`legal-guard/blocklist.ts` ve `state/draft-machine.ts` devreye girecek.

## Değişmez İletişim Anayasası (master prompt md. 2)

1. Başkan onayı olmadan hiçbir içerik yayımlanamaz (NO APPROVAL = NO PUBLICATION).
2. Hakaret, küfür, aşağılama, tehdit, kişisel saldırı, küçük düşürme dili yasak.
3. Kişilere/kurumlara doğrulanmamış suç isnadı yapılamaz.
4. Haber, yorum, iddia, değerlendirme birbirinden açıkça ayrılır.
5. Muhalif duruş korunur; saldırgan/ölçüsüz/hukuki riskli dil kullanılmaz.
6. HEP-SEN kurumsal kimliği ve sağlık çalışanlarının itibarı korunur.
7. Eleştiri somut talep/çözüm/açıklama çağrısıyla tamamlanır.
8. Kaynağı olmayan sayı/alıntı/karar/mevzuat bilgisi kullanılmaz.
9. Mikro-hedefleme veya kişiye özel ikna profili oluşturulmaz.
10. Bot takip/beğeni/yanıt/alıntı yapılmaz.
11. Yapay zekâ klişeleri, gereksiz ünlem/emoji/hashtag yoğunluğu engellenir.
12. Başka hesapların metinleri kopyalanmaz.

## Risk seviyeleri (`packages/core/src/legal-guard/blocklist.ts`)

`LOW` / `MEDIUM` → yayımlanabilir. `HIGH` / `BLOCKED` → yayın kapısı kapanır
(`canPublish()` false döner, DB seviyesinde de `drafts_risk_blocks_publish`
constraint'i bunu zorlar). Blocklist **deterministiktir, LLM'den önce çalışır
ve LLM'in "sorun yok" değerlendirmesini geçersiz kılar** (`combineRisk()`).

## Hashtag kuralı

0-2 hashtag, yanıtlarda (`content_type = 'reply'`) hiç hashtag yok — hem
`scoring/hashtag.ts`'de hem veritabanı constraint'lerinde
(`drafts_reply_no_hashtags`, `drafts_hashtag_limit`) zorlanıyor.

## Sözlükler seed veridir

Blocklist kelime/kalıp listeleri (`PROFANITY_ROOTS`, `HARSH_WORDS`, vb.)
başlangıç verisidir — Başkan ile birlikte gözden geçirilmeli ve
genişletilmelidir (bkz. `docs/adr/0001-hepsen-core-faz0.md`).
