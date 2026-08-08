---
criterion: ac6
status: pass
method: browser_probe
---
# Dünya yüklenmese de sayfa eksiksiz

Chromium `reducedMotion: 'reduce'` bağlamı, tam sayfa gezildi:

    canvas          -> false   (sahne HİÇ yüklenmedi)
    .czr-world-floor-> true    (statik gradyan zemin devrede)
    reveal          -> 39/39 görünür
    body.innerText  -> 8808 karakter

Karşılaştırma — tam dünya açıkken metin uzunluğu 8805 karakter.
Fark yok: içeriğin tamamı SSR ile DOM'da, sahne yalnızca dekor.

Mobil (390x844, isMobile): sahne `lite` modda çalışır — partikül yok,
DPR 1.25, geniş kadraj. canvas: true, metin 8653 karakter, taşma yok.

Kapı koşulları (`WorldStage.deviceCanRenderWorld`): reduced-motion,
saveData, deviceMemory < 3, hardwareConcurrency < 4, gerçek WebGL bağlamı.
