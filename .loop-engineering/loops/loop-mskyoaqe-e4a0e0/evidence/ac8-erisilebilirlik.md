---
criterion: ac8
status: pass
method: browser_probe
---
# Klavye ve odak

14 ardışık Tab adımı, her adımda `getComputedStyle(activeElement).outlineWidth`:

    adım: 14, odak görünür: 14/14  (hepsi 2px turuncu halka)

Örnek odak zinciri: galeri video düğmeleri, medya kartları — hepsi
`<button>`, erişilebilir metinleri var.

Sahne katmanı `aria-hidden="true"` ve `pointer-events: none`; ekran
okuyucuya görünmez, tıklamaları engellemez.

Yürüyüş rayı `<nav aria-label="Yürüyüş durakları">` + `aria-current`.
Ambiyans düğmesi `aria-pressed` taşır.
