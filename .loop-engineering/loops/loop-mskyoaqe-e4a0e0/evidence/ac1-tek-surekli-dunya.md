---
criterion: ac1
status: pass
method: browser_probe
---
# Tek sürekli WebGL sahnesi, scroll ile ilerleyen kamera

Playwright + Chromium, 1440x900, production build.

    document.querySelectorAll('canvas').length  -> 1
    document.querySelector('.czr-world canvas') -> var

Sayfa boyunca TEK canvas var; hero'daki ikinci WebGL bağlamı kaldırıldı.
Sahne `position: fixed` ile arkada durur ve scroll boyunca sökülmez.

Kamera 7 anahtar kare boyunca yol alır (`world/HangarWorld.tsx` PATH):

    p=0.00  [0, 1.7, 15.5]  -> hangar içi, kapılar kapalı
    p=0.34  [0, 2.1,  3.5]  -> koridor, bölmeler
    p=0.68  [3.4, 3.1, -13] -> fırlatma sahası
    p=1.00  [0, 4.2, -30]   -> konsol

7 scroll durağında ekran görüntüsü alındı; her durakta farklı kadraj:
`scratchpad/world/p000..p100.png`. Duraklar ölçüldü:

    [{"istenen":0,"olcum":0},{"istenen":0.34,"olcum":0.34},
     {"istenen":0.68,"olcum":0.68},{"istenen":1,"olcum":1}]

Konsol hatası: 0
