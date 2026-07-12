# Evidence — ac2: After (prefetch) TTFD karşılaştırması

- **Loop:** loop-mrgp6m54-2963ab · **Task:** T3
- **status: FAIL** (hedef %30 iyileşme sağlanmadı)
- **Metrik/Yöntem:** ac1 ile birebir aynı (Playwright headless, cold-forced students.get, N=20, medyan), tek fark prefetch kodu AÇIK + gerçekçi hover-dwell.

## Sonuçlar
| Ölçüm | dwell | n | medyan TTFD | baseline'a göre |
|---|---|---|---|---|
| baseline (prefetch yok) | 0 | 20 | **730.15 ms** | — |
| after | 350 ms | 20 | **721.10 ms** | **%1.2 ↓** |
| after (tanı) | 1500 ms | 12 | **721.65 ms** | **%1.2 ↓** |

Hedef: after ≤ 511 ms (%30). **Ulaşılamadı** (fark ölçüm gürültüsü içinde).

## Tanı — kök-neden hipotezi çürüdü
- Hover-dwell'i **1500 ms** (fetch süresi ~700 ms'yi tamamen kapsayacak kadar) yaptığımızda bile TTFD değişmedi.
- Prefetch veriyi tık anından çok önce hazır etse dahi TTFD düşmüyor → **`students.get` veri fetch'i geçişin darboğazı DEĞİL.**
- ~720 ms'yi domine eden: büyük olasılıkla **Next.js dev-mode client navigasyon + route/chunk yükleme + render** maliyeti (dev'de `<Link>` route-prefetch devre dışı, derleme/HMR overhead, minifiye olmayan bundle).
- Dolayısıyla dev-mode TTFD, prod'daki prefetch faydası için **geçerli bir vekil değil** (confounded ölçüm ortamı).

## Sonuç / karar
1. Veri-prefetch kodu düşük riskli ve prod'da (route-prefetch açık + optimize bundle) muhtemelen fayda sağlar — ama bunu **dev'de kanıtlayamıyoruz**.
2. Geçerli doğrulama için ölçüm **production build** (`next build && next start`) üzerinde yapılmalı; ya da ~720 ms'nin gerçek dağılımı profillenip asıl darboğaz optimize edilmeli.
3. Bu iterasyonda `optimization` sözleşmesinin ac2'si **karşılanmadı** → stop_condition: no_measurable_improvement. Strateji değişikliği gerekiyor (bkz. rapor).
