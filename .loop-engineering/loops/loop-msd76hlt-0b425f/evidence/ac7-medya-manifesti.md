# AC7 — Gerçek medya manifesti tip güvenli ve dolu
status: pass
verified_at: 2026-08-03T18:34:35Z
method: build + test_run

## Manifest içeriği
```
kayıt sayısı: 11
  saha-roket-firlatma-01
  atolye-iha-uretim-01
  saha-iha-simurgh-01
  ekip-egitmenler-01
  atolye-ldr-dersi-01
  atolye-tur-01
  saha-roket-mizrak-01
  ekip-iha-takim-01
  saha-hava-cekimi-01
  saha-roket-ekip-01
  etkinlik-avm-standi-01
```

## Varlıklar sunucudan geliyor mu?
```
200  1408469 B  /assets/real-media/saha-roket-firlatma-01.mp4
200  137718 B  /assets/real-media/saha-roket-firlatma-01-poster.webp
200  1175882 B  /assets/real-media/atolye-iha-uretim-01.mp4
200  124920 B  /assets/real-media/ekip-egitmenler-01.webp
200  99004 B  /assets/real-media/atolye-ldr-dersi-01.webp
200  151686 B  /assets/real-media/etkinlik-avm-standi-01.webp
200  761998 B  /assets/brand/cezeri-baykus-sekans.mp4
```

## Poster öncelikli yükleme (performans)
Playwright ile tüm sayfa baştan sona gezildiğinde indirilen video dosyaları:
```
sayfa gezintisi     -> ["cezeri-baykus-sekans.mp4"]   (yalnızca marka sekansı)
galeri videoları    -> hiçbiri indirilmedi            (~7 MB tasarruf)
kart açıldığında    -> ["saha-roket-firlatma-01.mp4"] (talep üzerine)
```

## Tip zorlaması
`RealVideo` tipinde `poster`, `posterWidth`, `posterHeight`, `durationSec`
ZORUNLU; `RealImage` ve `RealVideo` ortak tabanında `alt`, `caption`,
`width`, `height` zorunlu. Eksik alan derlemeyi durdurur.

## Filtreler manifest'ten türetiliyor
Boş kategori için düğme üretilmiyor — arayüzdeki filtreler:
Tümü, Atölye, İHA / VTOL, Saha Testi, Ekip.
(`3d-baski` ve `robotik` varlık gelmediği için görünmüyor.)
