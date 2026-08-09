---
criterion: ac9
status: pass
method: browser_probe
revised: 2026-08-09
---
# Yatay taşma yok

Playwright + Chromium, production build (`next start -p 4173`), tam
sayfa gezildikten sonra ölçüldü.

## Masaüstü 1440x900

    scrollWidth  1440
    clientWidth  1440
    fark         0

## Mobil 390x844 (deviceScaleFactor 2)

    scrollWidth  390
    clientWidth  390
    fark         0

Kaynak: `scratchpad/verify-final.mjs` çıktısı

    "masaustu": { "scrollW": 1440, "clientW": 1440, ... }
    "mobil":    { "scrollW":  390, "clientW":  390, ... }

ve `scratchpad/verify-mobil.mjs`

    MOBIL {"overflow":0, ...}

## Riskli iki nokta ve nasıl kapatıldığı

1. `.czr-veil::before` bilerek kenarlardan taşar (`inset: -14% -10%`);
   dar ekranda bu belgeye yatay kaydırma ekliyordu. `.czr-chapter`
   üzerinde `overflow-x: clip` ile kesildi — `hidden` değil, çünkü
   `hidden` yeni bir kaydırma bağlamı açar ve içerideki `sticky`
   davranışını bozardı.

2. Ön plan şeridi (`.czr-foreground`) `fixed inset-x-0` ve kendi
   kapsayıcısında `overflow-hidden`; içindeki katman kapsayıcının altına
   taşar (`-bottom-[20%] h-[140%]`) ama yatayda taşmaz.
