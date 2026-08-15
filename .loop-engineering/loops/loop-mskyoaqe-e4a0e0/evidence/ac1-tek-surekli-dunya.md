---
criterion: ac1
status: pass
method: browser_probe
revised: 2026-08-09
---
# Tek sürekli dünya, scroll ile ilerleyen kamera

> REVİZYON NOTU. Bu kanıt 2026-08-09'da yeniden ölçüldü. Dünya artık
> tamamen prosedürel geometri değil: mekân boyalı katmanlarla kuruluyor
> (`SceneParallax`), WebGL yalnızca atmosfer ve kategori efektlerini
> taşıyor (`FxCanvas`). Ölçüm bu yapıya göre tekrarlandı; önceki
> `HangarWorld` PATH değerleri artık geçerli değildir.

Playwright + Chromium, 1440x900, production build (`pnpm --filter web build`,
`next start -p 4173`).

    document.querySelectorAll('canvas').length  -> 1

Sayfa boyunca TEK WebGL bağlamı var. Sahne `position: fixed` ile arkada
durur ve scroll boyunca hiç sökülmez.

## Kamera scroll ile ilerliyor

`world/CameraDrift.tsx` her karede `worldClock.progress`'ten hedef üretir
ve kamerayı ona yaklaştırır (lerp, EASE = 0.055):

    hedefY = 2.4 + p * 1.9
    hedefZ = 9.0 - p * 2.6
    hedefX = sin(p * PI) * 0.85
    lookAt(0, 1.8 + p * 1.4, -2)

## Boyalı katmanlar farklı hızda kayıyor

`world/SceneParallax.tsx` — dört düzlem, her biri kendi sürüklenme ve
yakınlaşma katsayısıyla:

    gök      drift 0.04  zoom 0.06
    hangar   drift 0.10  zoom 0.14
    apron    drift 0.20  zoom 0.22
    ön plan  drift 0.12  zoom 0.14   (içeriğin ÜSTÜNDE, z-20)

## Ölçüm

Sahnenin gerçekten canlı olduğu, iki kare arası piksel farkıyla
doğrulandı (scroll durmuşken, 900 ms arayla iki tam sayfa görüntüsü):

    worldAnimating: true

Konsol hatası: 0 (`scratchpad/verify-kage.mjs` çıktısı, "errors": []).
