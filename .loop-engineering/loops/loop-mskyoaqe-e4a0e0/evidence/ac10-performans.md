---
criterion: ac10
status: pass
method: build_run
---
# İlk yük bütçesi

    Route (app)                Size      First Load JS
    ┌ ○ /                      19.1 kB   107 kB

Hedef <= 200 kB. three.js + @react-three/fiber ilk yükte DEĞİL:
`world/WorldStage.tsx` içinde `next/dynamic(..., { ssr: false })` ile
ayrı chunk'a alınır ve yalnızca `requestIdleCallback` sonrası indirilir.

Bu yüzden LCP metni (hero başlığı) sahneyi beklemez — sunucuda render
edilmiş HTML'de gelir.

CLS: sahne `position: fixed` katmandadır, akıştaki hiçbir kutuyu
itmez; yükleme sırasında düzen kaymaz. 7 scroll durağında görsel
sıçrama gözlenmedi.

Ambiyans sesi `preload="none"`: kullanıcı açmadıkça tek bayt inmez.
