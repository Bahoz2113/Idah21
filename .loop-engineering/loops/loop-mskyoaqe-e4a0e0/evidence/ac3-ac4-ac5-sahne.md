---
criterion: ac3,ac4,ac5
status: pass
method: screenshot_diff + file_check
---
# Wordmark occlusion, atmosfer, anlatı çerçevesi

ac3 — Wordmark sahnenin İÇİNDE:
`CEZERÎ` 3D uzayda [0, 2.4, -6] konumunda bir düzlemdir. Tavan kirişleri
z = 12 … -21 aralığında, y = 6.6'da; kamera z = 15.5'ten baktığında
kirişler harflerin ÖNÜNDEDİR. Occlusion CSS ile taklit edilmedi —
derinlik testinin doğal sonucu.
Kanıt: scratchpad/final/masaustu-hero.png — harfler drone ve kirişlerin
arkasında kalıyor; koridora girildikçe (p>0.08) sönüyor.

Metin canvas dokusuna çizilir: ~200 kB typeface indirmesi ve FOUT yok.

ac4 — Atmosfer:
700 parçacıklı `Motes` sistemi; toz yükselir, scroll hızı (worldClock.velocity)
onu geriye sürükler. `lite` cihazlarda ve reduced-motion'da hiç oluşturulmaz
(reduced-motion'da sahnenin tamamı yüklenmez — bkz. ac6).

ac5 — Anlatı ve gösterge:
Bölüm kodları duraklara döndü: DURAK 02 … DURAK 06.
`StationRail` ekranın sağında 7 durağı gösterir; dolgu scroll ile büyür,
aktif durak turuncuya döner ve etiketi açılır. Durak DOM konumundan
hesaplanır, sayfa yüksekliğinden değil.
Sahneden bağımsızdır: WebGL kapalıyken de doğru çalışır.
Kanıt: masaustu-hero.png sağ kenar "00 EŞİK",
       world/p034 "02 HANGARLAR", world/p052 "03 SAHA".
