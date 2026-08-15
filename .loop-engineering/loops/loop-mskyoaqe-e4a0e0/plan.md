# Plan — Kinematik Hangar Dünyası

## Teşhis (referans karşılaştırması)

KAGE'nin yaptığı, mevcut sayfamızın yapmadığı beş şey:

1. **Tek sürekli dünya.** Sahne sayfanın arkasında `position: fixed` yaşar,
   scroll boyunca hiç sökülmez; kamera bir yol boyunca ilerler. Bizde 3D
   yalnızca hero'nun içinde bir kutu.
2. **Opak zemin yok.** İçerik dünyanın üstünde yüzer. Bizde her bölüm
   `bg-czr-base` / `bg-czr-base-alt` ile sahneyi kapatıyor.
3. **Tipografi sahnenin içinde.** Dev wordmark 3D uzayda durur, ön plandaki
   geometri harflerin önünden geçer — sahte değil gerçek derinlik.
4. **Sürekli atmosfer.** Düşen yaprak / kor / sis hiç durmaz.
5. **Anlatı çerçevesi.** "CHAPTER 00 → 05"; bölüm değil, yürüyüş.

## Cezerî karşılığı — dünyanın senaryosu

Brief'in tarif ettiği atmosfer (Cezerî + İHA hangarı + NASA disiplini) tek bir
mekâna oturuyor: **gece hangarı ve önündeki fırlatma sahası.**

| Bölüm | Kameranın yeri | Dünyada ne olur |
|---|---|---|
| 00 Eşik | Hangar içi, kapılar kapalı | `CEZERÎ` wordmark'ı zemin isinde; drone rotor ısıtıyor, toz ışıkta |
| 01 Telemetri | Kapılar aralanır | Dış ışık içeri düşer, sayaçlar hangar duvarına vurur |
| 02 Hangarlar | Koridor boyunca ilerleme | 10 disiplin, koridorun bölmeleri olarak sırayla aydınlanır |
| 03 Saha | Kapıdan dışarı | Rampa, roket, gece ufku; kıvılcım partikülleri |
| 04 Saha notları | Sahanın üstünde asılı | Gerçek atölye medyası aydınlatılmış paneller olarak |
| 05 Miras | Sise dönüş | Pirinç dişliler döner, rotora dönüşür |
| 06 Konsol | Kontrol masası | SSS + iletişim; telemetri satırları |

## Mimari

```
<div class="czr-site">
  <WorldStage />        <- fixed, inset-0, tek <canvas>, aria-hidden
  <main class="relative z-10">
     <Chapter id="esik">      ... </Chapter>   <- şeffaf
     <Chapter id="telemetri"> ... </Chapter>
     ...
  </main>
</div>
```

- `WorldStage` scroll ilerlemesini (0→1) tek bir `useRef` üzerinden okur;
  React state güncellemesi yok — her frame `useFrame` içinde lerp.
- Kamera yolu: bölüm sınırlarına bağlı anahtar kareler; aradaki değerler
  `damp3` ile yumuşatılır (scroll jank'ini sahneye taşımamak için).
- Wordmark: 3D uzayda düzlem; önüne hangar kirişleri/toz düzlemleri konur →
  gerçek occlusion.
- Partiküller: tek `Points` + shader; reduced-motion'da `pause`.

## Progressive enhancement (pazarlık dışı)

Dünya **dekoratiftir**. Tüm metin, JSON-LD ve etkileşim SSR ile DOM'da kalır.
WebGL yoksa / reduced-motion / zayıf cihaz / dar ekran → `WorldStage` hiç
yüklenmez, `.czr-site` statik koyu zemine düşer. Bu yüzden şeffaf bölümlerin
altında her zaman bir taban katman (gradient) bulunur.

## Adımlar

1. `world/` iskeleti: `WorldStage`, `useScrollProgress`, kamera yol tanımı
2. Hangar geometrisi + wordmark occlusion
3. Partikül sistemi + atmosfer
4. Bölümlerin şeffaf `Chapter` bileşenine taşınması, opak zeminlerin sökülmesi
5. Chapter göstergesi (ilerleme rayı)
6. Fallback katmanı ve reduced-motion yolu
7. Doğrulama: build + Playwright probe (kamera, taşma, klavye, WebGL kapalı)

## Riskler

- **LCP.** three.js ilk yüke girerse bütçe patlar → `next/dynamic ssr:false` +
  `requestIdleCallback` kapısı korunur.
- **Okunabilirlik.** Hareketli sahne üzerinde metin kontrastı düşebilir →
  her chapter'ın arkasına yerel radial scrim.
- **Mobil.** Tam sahne mobilde pil yakar → mobilde hafif sürüm (partikül yok,
  düşük DPR) veya statik.
- **Regresyon.** SEO düğümleri ve mevcut etkileşimler korunmalı (ac7, ac12).
