---
criterion: ac5
status: pass
method: browser_probe + file_check
---
# Yürüyüş anlatısı ve ilerleme göstergesi

Bölüm etiketleri duraklara döndü (page.tsx):
    BÖLÜM 03..07  ->  DURAK 02..06

`world/StationRail.tsx`: ekranın sağ kenarında 7 durak
(00 EŞİK, 01 TELEMETRİ, 02 HANGARLAR, 03 SAHA, 04 MİRAS, 05 SORULAR,
06 KONSOL). Ray dolgusu scroll ile scaleY(0→1); aktif durak turuncuya
döner ve etiketi açılır.

Aktif durak sayfa yüzdesinden değil, durakların GERÇEK DOM konumundan
hesaplanır (getBoundingClientRect) — gösterge içerikle örtüşür.

Sürekli değişen dolgu DOM stiline yazılır; React yalnızca aktif durak
değişince render olur.

Ölçüm:
    nav[aria-label="Yürüyüş durakları"] -> var
    masaustu-hero.png sağ kenar   : "00 EŞİK"
    world/p034.png                : "02 HANGARLAR"
    world/p052.png                : "03 SAHA"

Sahneden bağımsız: `observeWorld()` WebGL olmadan da çalışır, reduced-motion
ekran görüntüsünde ray yerinde.
