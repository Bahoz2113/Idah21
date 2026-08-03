# AC11 — Yüz anonimleştirme (KVKK)
status: pass
verified_at: 2026-08-03T19:26:37Z
method: file_check + görsel doğrulama

## Yöntem
`scripts/anonymize-faces.py` — üç katmanlı:
1. YuNet ONNX yüz tespiti (eşik 0.45, kaçırmaktansa fazla yakala)
2. Zamansal iz sürme (tespit düşerse 12 kare daha maskele) — tek bir açık
   kare bile anonimleştirmeyi geçersiz kılar
3. Kutu %35 genişletme + pikselleştirme(÷14) + Gauss + oval yumuşak maske

Pikselleştirme geri döndürülemez; yalnızca Gauss bulanıklık yeniden
netleştirme saldırılarına karşı bilgi bırakabilirdi.

## İşlenen varlıklar
```
saha-roket-firlatma-01   video  330 kare, 472 yüz maskesi
saha-roket-mizrak-01     video  184 kare, 260 yüz maskesi
saha-hava-cekimi-01      video  270 kare, 863 yüz maskesi
atolye-ldr-dersi-01      foto    15 yüz maskesi
etkinlik-avm-standi-01   foto    38 yüz maskesi
ekip-iha-takim-01        foto    17 yüz maskesi
saha-roket-ekip-01       foto    23 yüz maskesi
```

## Kasıtlı istisnalar
- `ekip-egitmenler-01` — eğitmen kadrosu portresi. Kurumun kendi çalışanları,
  tanıtım amacıyla çekilmiş; fotoğrafın konusu onlar. Maskelenmedi.
- `atolye-tur-01`, `atolye-iha-uretim-01`, `saha-iha-simurgh-01` — insan
  yüzü içermiyor (yalnızca eller, ekipman, gökyüzü). Tespit bu kliplerde
  yalnızca yanlış pozitif üretti (duvar çizimi, 3D baskı figürü), bu yüzden
  maskeleme UYGULANMADI — gereksiz leke bırakmamak için.

## Görsel doğrulama
Playwright ile galeri 1440x1000'de yakalandı; her kartta yüzler maskeli
görünüyor. Doğrulama sırasında Next.js görsel önbelleğinin eski (maskesiz)
sürümleri sunduğu tespit edildi ve `.next/cache/images` temizlenerek
yeniden doğrulandı — diskteki kaynak dosyalar doğru maskelenmiş.
