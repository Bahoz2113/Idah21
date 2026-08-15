---
criterion: ac2
status: pass
method: browser_probe + file_check
---
# Bölümlerin opak zemini kalmadı

    document.querySelectorAll('.czr-chapter.bg-czr-base, .czr-chapter.bg-czr-base-alt').length
    -> 0

Sökülen zeminler:
- page.tsx: 5 bölüm `bg-czr-base` / `bg-czr-base-alt` -> `czr-chapter`
- MetricsDeck.tsx: `bg-czr-base` -> `czr-chapter`
- HeroLaunchpad.tsx: `bg-czr-hero` -> `czr-chapter`
- MarketingFooter.tsx: opak -> `bg-czr-base/80 backdrop-blur-xl`

Kalan `bg-czr-base` kullanımları kart/rozet/modal yüzeyleridir; bunların
opak olması kasıtlıdır (dünyanın üstünde duran paneller).

Okunabilirlik genel karartma ile değil, metnin arkasındaki yerel perde
(`.czr-veil`, SectionHeading) ile sağlanır — sahne görünür kalır.
