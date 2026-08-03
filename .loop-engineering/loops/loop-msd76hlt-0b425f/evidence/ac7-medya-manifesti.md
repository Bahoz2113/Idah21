# AC7 — Gerçek medya manifesti tip güvenli ve dolu
status: pass
verified_at: 2026-08-03T20:52:26Z
method: build + test_run

## Manifest içeriği
```
  [BELGESEL] saha-roket-firlatma-01
  [BELGESEL] atolye-iha-uretim-01
  [BELGESEL] saha-iha-simurgh-01
  [BELGESEL] ekip-egitmenler-01
  [BELGESEL] atolye-ldr-dersi-01
  [BELGESEL] atolye-tur-01
  [KONSEPT]  3d-baski-uretim-01
  [KONSEPT]  robotik-tezgah-01
  [BELGESEL] saha-roket-mizrak-01
  [BELGESEL] ekip-iha-takim-01
  [BELGESEL] saha-hava-cekimi-01
  [BELGESEL] saha-roket-ekip-01
  [KONSEPT]  robotik-montaj-01
  [KONSEPT]  3d-baski-atolye-01
  [BELGESEL] etkinlik-avm-standi-01

toplam: 15  (belgesel 11, konsept 4)
```

## Kategori filtreleri (manifest'ten türetiliyor)
```
Tümü, Atölye, İHA / VTOL, Saha Testi, 3D Baskı, Robotik, Ekip
```
Konsept varlıklar eklendiğinde `3d-baski` ve `robotik` filtreleri
kendiliğinden belirdi — elle liste güncellemesi gerekmedi.

## Poster öncelikli yükleme
```
tüm sayfa gezildi -> inen galeri videosu: 0    (~9 MB tasarruf)
kart açıldığında  -> yalnızca o video iniyor
```

## Kaynak ayrımı
4 varlık `source: "generated"` işaretli ve kartta "KONSEPT" etiketi taşıyor.
Bunlar schema'da `contentLocation` almıyor (Batman atölyesinde çekilmedi)
ve `creditText` ile üretim yöntemi bildiriliyor.
