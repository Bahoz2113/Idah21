# @hepsen/core

HEP-SEN Batman — Başkanlık İletişim OS'un **saf iş mantığı çekirdeği**.

Bu paket ağ, veritabanı veya kimlik doğrulama içermez. Sistemin yanlış yapılması
en pahalıya patlayacak kısımları burada, testli ve deterministik olarak durur:

| Modül | Ne yapar |
|---|---|
| `legal-guard/blocklist.ts` | Deterministik Türkçe hukuk guard'ı. LLM'den bağımsız, tek başına BLOCKED verebilir ve LLM'i ezer. |
| `state/draft-machine.ts` | Taslak durum makinesi + yayın kapısı (hash doğrulaması, idempotency, acil durdurma). |
| `budget/guard.ts` | Provider bazlı bütçe kesme. Onaylı içeriğin yayını bütçe yüzünden durmaz; sert tavan hariç. |
| `scoring/topic.ts` | Gündem puanlama, eşik ve tek kaynaklı ağır iddia kuralı. |
| `scoring/hook.ts` | Açılış cümlesi gücü ve iyileştirme önerileri. |
| `scoring/hashtag.ts` | 0-2 etiket seçimi; yanıtlarda etiket yok. |
| `timing/optimizer.ts` | Soğuk başlangıç ağırlıkları, %80/%20 keşif, kritik içerikte deney yasağı. |
| `reply/author-type.ts` | Yazar sınıflandırması. Bireysel hesaplara yanıt fırsatı oluşmaz. |
| `dedup/content-hash.ts` | Türkçe-güvenli normalize, hash ve benzerlik. |
| `types/schemas.ts` | LLM çıktı sözleşmeleri (Zod). |
| `prompts/` | Versiyonlu prompt katmanları; cache'lenen önek ayrı dosyada. |

`supabase/migrations/0001_init.sql` tam şemayı, indeksleri, RLS politikalarını ve
audit log değiştirilemezlik trigger'ını içerir. Birkaç kural veritabanı seviyesinde
de zorlanır: yanıtlarda hashtag olamaz, HIGH/BLOCKED taslak APPROVED olamaz,
`reply_opportunities` tablosuna `individual` yazar tipi giremez.

## Kurulum

```bash
npm install && npm test && npm run typecheck
```

62 test, hepsi geçiyor.

## Monorepo'ya yerleştirme

```bash
mkdir -p packages/core && cp -r src tests package.json tsconfig.json vitest.config.ts packages/core/
cp -r supabase /path/to/repo/
```

`packages/core` adını `@hepsen/core` olarak workspace'e ekle, `apps/web` içinden
`import { runBlocklist, publishGate } from "@hepsen/core"` şeklinde kullan.

## Sırada ne var

Bu çekirdek Faz 2 ve Faz 3'ün mantık kısmını karşılıyor. Kalan işler ağ, kimlik
ve UI gerektirdiği için Claude Code'da, kendi repo'nda yapılmalı:

1. `HEPSEN_MASTER_PROMPT_v2.md` ve `IMPLEMENTATION_PLAN.md` dosyalarını repo köküne koy.
2. Bu paketi `packages/core` olarak yerleştir.
3. Claude Code'a şunu ver: *"HEPSEN_MASTER_PROMPT_v2.md'yi uygula. packages/core
   zaten hazır ve testli — iş mantığını yeniden yazma, import et. Faz 0
   doğrulamalarıyla başla."*

## Faz 0'da mutlaka doğrula

- `src/config/pricing.ts` içindeki `verifiedAt` alanı `null`. Tüm birim fiyatlar
  tahmindir; X, Apify ve Anthropic konsollarından doğrulanıp güncellenmeli.
- Blocklist sözlükleri seed verisidir. Başkanla birlikte gözden geçirilmeli ve
  "yasak ifadeler" listesiyle genişletilmeli.
