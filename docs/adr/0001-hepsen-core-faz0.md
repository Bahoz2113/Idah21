# ADR 0001 — HEPSEN çekirdeğinin yerleştirilmesi ve Faz 0 doğrulaması

- **Tarih:** 2026-07-26
- **Durum:** Faz 0 tamamlandı (kısmi) — Faz 1 için gerekli girdiler eksik, bekleniyor.
- **Branch:** `claude/hepsen-core-implementation-imxw4d`

## Bağlam

Bu repo (`Bahoz2113/Idah21`) ana hatlarıyla **CEZERİ ROBOTECH — Education OS**
projesidir ve HEPSEN (HEP-SEN Batman — Başkanlık İletişim OS) ile iş alanı
olarak hiçbir ilişkisi yoktur. Görev tanımı bu repoda özel olarak
`claude/hepsen-core-implementation-imxw4d` dalını hedef gösterdiği ve hesapta
başka erişilebilir bir repo bulunmadığı için, HEPSEN çekirdeği bu dala,
mevcut education-OS koduna dokunmadan, **izole bir workspace paketi** olarak
yerleştirildi.

Girdi olarak sağlanan dosyalar:
- `README.md`, `blocklist.ts`, `supabase/migrations/0001_init.sql` (örnek/özet)
- `hepsencore.tar.gz` — `packages/core` için tam kaynak (`src/`, `tests/`,
  `package.json`, `tsconfig.json`, `vitest.config.ts`) + aynı SQL şeması.

**`HEPSEN_MASTER_PROMPT_v2.md` ve `IMPLEMENTATION_PLAN.md` sağlanmadı** — ne bu
repoda ne de yüklenen dosyalar arasında mevcut. Bu iki dosya olmadan Faz 1+
kapsamı (ağ, kimlik doğrulama, UI, agent orkestrasyonu) tanımsızdır ve
uydurulmamıştır.

## Yapılanlar

1. `packages/core` oluşturuldu; tar.gz içeriği birebir kopyalandı (`diff -rq`
   ile doğrulandı, fark yok). `package.json` adı zaten `@hepsen/core`;
   `main`/`types`/`license` alanları diğer workspace paketleriyle (`@cezeri/*`)
   tutarlı hale getirildi. `tsconfig.json`, kök `tsconfig.base.json`'ı extend
   edecek şekilde güncellendi (davranış değişmedi, sadece tutarlılık).
2. `supabase/migrations/0001_init.sql` repo köküne, `supabase/migrations/`
   altına eklendi (repo şu ana kadar Prisma/Supabase-Auth kullanıyordu, ayrı
   bir Supabase migration dizini yoktu — bu ekleme yeni ve katkılı, mevcut
   Prisma şemasıyla çakışmıyor).
3. `pnpm-workspace.yaml` zaten `packages/*` deseniyle paketi otomatik kapsıyor;
   ekstra workspace değişikliği gerekmedi.
4. `apps/web` içinde HEPSEN'e ait hiçbir import eklenmedi — Faz 1 kapsamı
   belirsiz olduğundan mevcut education-OS uygulama kodu değiştirilmedi.

## Kanıt

```
pnpm install                     → başarılı (mobile'daki react-native peer-dep
                                    uyarısı önceden var, HEPSEN ile ilgisiz)
pnpm --filter @hepsen/core test  → 7 test dosyası, 62/62 test PASS
pnpm --filter @hepsen/core typecheck → tsc --noEmit, hatasız
```

## Faz 0 doğrulama maddeleri (README "Faz 0'da mutlaka doğrula")

### 1. `src/config/pricing.ts` → `verifiedAt`
- **Durum: DOĞRULANMADI.** `DEFAULT_PRICING.verifiedAt` hâlâ `null`.
- İçerdiği tüm birim fiyatlar (Anthropic `claude-haiku-4-5` / `claude-sonnet-5`
  input/output/cache; Apify `costPer1kTweets` / `freeMonthlyCreditUsd`; X API
  `postCreateNoLink` / `postCreateWithLink` / `replyCreate` / `readOwnPost` /
  `readThirdPartyPost`) **tahminidir**, resmi konsollardan teyit edilmedi.
- **Blocker:** Bu teyit, Anthropic Console, Apify Console ve X Developer
  Portal'a gerçek erişim ve hesaba özgü fiyatlandırma/plan bilgisi gerektirir
  — burada uydurulamaz. Bütçe guard'ı (`budget/guard.ts`) bu tabloya güvenerek
  sert tavan uyguladığından, gerçek harcama başlamadan önce bu alan
  doldurulmalı ve `verifiedAt` gerçek bir ISO tarihiyle set edilmeli.

### 2. Blocklist sözlükleri (`src/legal-guard/blocklist.ts`)
- **Durum: SEED, gözden geçirilmedi.** Kod aynen (değiştirilmeden) taşındı.
  Mevcut kapsam: `profanity` (21 kök), `personal_insult`, `crime_accusation`,
  `threat`, `discrimination`, `private_life`, `health_data`, `harsh_word` (7
  kelime), `absolute_claim`, `named_person` — toplam 10 kategori, testli (62
  test, blocklist için 11 tanesi).
  - **Blocker:** README bunun "Başkan ile birlikte gözden geçirilmeli ve
    'yasak ifadeler' listesiyle genişletilmeli" olduğunu belirtiyor — bu,
    ürün sahibinin (Başkan/kullanıcı) onayı gerektiren bir içerik/politika
    kararıdır, kod tarafında tahmin edilemez.

### 3. Repo/kapsam uyuşmazlığı (bu ADR'ye özgü ek bulgu)
- Kullanıcı bu paketin CEZERİ Education OS reposuna eklenmesinin **"yanlış
  repo"** olduğunu teyit etti, ancak hesapta erişilebilir başka repo yok ve
  görev altyapısı bu depoda özel bir dal atadı. Bu nedenle paket, mevcut
  eğitim uygulamasından tamamen izole (hiçbir `apps/*` import'u yok) şekilde
  bırakıldı. **Kalıcı çözüm** (ayrı repo mu, yoksa bilinçli tek-repo çoklu-ürün
  mü) kullanıcı kararını bekliyor.

## Sonraki adım için blocker

Faz 1'e (README: "ağ, kimlik ve UI gerektiren kalan işler") geçilmedi çünkü:
- `HEPSEN_MASTER_PROMPT_v2.md` yok → sistem/ürün sözleşmesi tanımsız.
- `IMPLEMENTATION_PLAN.md` yok → faz sınırları, kabul kriterleri, sıralama
  tanımsız.

Bu iki dosya sağlanmadan CLAUDE.md kural 1 ("Contract olmadan büyük iş
başlatma") ve kural 2 ("Plan olmadan implementation yok") gereği Faz 1
başlatılmayacak.
