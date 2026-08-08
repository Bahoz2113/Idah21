---
criterion: ac9,ac10,ac11,ac12
status: pass
method: build_run + browser_probe
---
# Taşma, performans, build, mevcut işlevsellik

ac9 — yatay taşma yok:
    masaüstü 1440: scrollWidth 1440 == clientWidth 1440
    mobil     390: scrollWidth  390 == clientWidth  390

ac10 — ilk yük bütçesi:
    Route /   19.1 kB   First Load JS 107 kB     (hedef <= 200 kB)
    three.js + R3F dinamik chunk'ta; ilk yüke girmiyor.
    Sahne `requestIdleCallback` sonrası yüklenir, LCP metni etkilenmez.

ac11 — pnpm --filter web build: EXIT=0, tip hatası yok.

ac12 — mevcut işlevsellik korundu:
    SSS akordeonu : 10 adet, açılıp kapanıyor (native <details>)
    video modalı  : açılıyor, kaynak saha-roket-firlatma-01.mp4 bağlanıyor
    iletişim      : WhatsApp / Instagram / Maps kartları ve tel/mail yerinde
    menü          : #esik #telemetri #hangarlar #atolye #miras #sss #iletisim
    konsol hatası : 0
