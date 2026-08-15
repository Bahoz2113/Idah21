---
criterion: ac4
status: pass
method: file_check + browser_probe
revised: 2026-08-09
---
# Sürekli atmosfer partikülleri

> REVİZYON NOTU. Önceki kanıt `HangarWorld` içindeki `Motes` sistemini
> gösteriyordu. O bileşen dünya boyalı katmanlara geçince sahneden
> çıktı ve atmosfer bir süre HİÇ çalışmadı — sahne yalnızca kategori
> efekti oynarken canlıydı, arada donuyordu. Sistem `world/Atmosphere.tsx`
> olarak yeniden kuruldu; bu kanıt onu ölçer.

`world/Atmosphere.tsx` — iki ayrı alan, `FxCanvas` içinde her zaman
monte edilir (kategori efektinden bağımsız):

    TOZ  (Dust)   420 parçacık  ·  buz rengi  ·  size 0.034  ·  opacity 0.42
    KÖZ  (Embers)  64 parçacık  ·  turuncu    ·  size 0.085  ·  opacity 0.32

`lite` cihazda kapatılmaz, küçültülür: 150 / 26. Havası olmayan bir
mekân mobilde de ölü görünür.

Hareket:
- her parçacık kendi tohumuyla yükselir (`rise * (0.55 + s)`), tepeye
  varınca tabana döner
- yatayda sinüs salınımı (`sin(t * 0.3 + s * 14) * sway`)
- scroll hızı z ekseninde geriye sürükler: `drag = worldClock.velocity * 110`
- kutunun dışına çıkan parçacık öbür uçtan geri girer (sarmalama) —
  yeniden üretim maliyeti yok

Materyal: `AdditiveBlending`, `depthWrite=false`, `sizeAttenuation`.

## Durdurma koşulları

- `prefers-reduced-motion: reduce` → sahnenin tamamı hiç yüklenmez
  (`WorldStage.deviceCanRenderWorld` kapısı)

Ölçüm (`scratchpad/verify-mobil.mjs`, reducedMotion='reduce' bağlamı):

    AZALTILMIS {"canvas":false,"worldFilter":"none","worldOpacity":"1"}

## Canlılık ölçümü

Scroll durmuşken 900 ms arayla iki tam sayfa görüntüsü alındı ve
karşılaştırıldı:

    worldAnimating: true

Konsol hatası: 0.
