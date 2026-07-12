# Contract revizyon: v1 → v2

- **Tarih:** 2026-07-11T19:09:03.095Z
- **Yapan:** /loop-design
- **Gerekce:** v1 `loop init` tarafindan uretilmis jenerik iskeletti. Amac ve kabul
  kriterleri olculebilir degildi; olcum yontemi ve kapsam tanimsizdi. Design asamasi
  bunlari kodun gercegine gore somutlastirdi.

## Diff ozeti (v1 → v2)

| Alan | v1 | v2 |
|------|----|----|
| objective | "sayfa gecis suresini %30 azalt" (belirsiz metrik) | TTFD metrigi + medyan + prefetch mekanizmasi acik tanimli |
| in_scope | "repository ici degisiklikler" | 4 somut dosya/alan (liste, detay, useStudents, RQ cache) |
| out_of_scope | 3 madde | +backend router imza degisikligi, +agir test bagimliligi eklememe |
| acceptance_criteria | 3 serbest metin | ac1/ac2/ac3 id'li, olcum artefakti + verify yontemi bagli |
| measurement | yok | TTFD, performance.mark/measure, N=20, median, sabit ortam |
| forbidden_actions | production_deploy | +data_delete, +secret_change |

## Onemli kabul: olcum yontemi
Kullaniciya soruldu (AskUserQuestion). Secim: **kod ici instrumentation**
(performance.mark/measure, N=20 kosu medyani). Alternatifler (Playwright E2E,
tRPC query latency) reddedildi — birincisi agir bagimlilik, ikincisi tam sayfa
gecisini degil sadece fetch'i olcuyor.

Degismeyen cekirdek: quality_threshold 70, target_score 80, max_iterations 6,
risk_level medium, template optimization.
