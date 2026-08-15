# AC6 — Hero LCP sunucudan, 3D sahne korumalı/lazy
status: pass
verified_at: 2026-08-03T12:53:52Z
method: file_check + build analizi

## LCP elemanı ön-render edilmiş HTML'de mi?
```
h1 sunucu HTML'inde mevcut: EVET
içerik: HAYAL ET, KODLA, GELECEĞİ TASARLA.
```

## three / R3F ilk pakette mi?
Build çıktısı — kök rota:
```
┌ ○ /                                    17.1 kB         105 kB
+ First Load JS shared by all            87.5 kB
```
Kök rota ilk yükü 105 kB; paylaşılan taban 87.5 kB. three.js (~500 kB) ilk pakette DEĞİL —
`next/dynamic` + `ssr:false` ile ayrı chunk'a alındı.

## Koruma katmanları (HeroScene.tsx)
```
12: *   1. Sayfa ilk boyamasını tamamlamış olmalı (requestIdleCallback)
22:  ssr: false,
26:type NetworkInformation = { saveData?: boolean };
32:  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
35:    deviceMemory?: number;
40:  if (nav.connection?.saveData) return false;
42:  // deviceMemory/hardwareConcurrency bilgisi olmayan tarayıcılarda (Safari)
45:  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
46:  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
49:  if (window.innerWidth < 768) return false;
61:      window.requestIdleCallback?.bind(window) ??
```

## Mobil doğrulama (390x844)
WebGL guard devrede — sahne yüklenmedi, yatay taşma 0 px.
