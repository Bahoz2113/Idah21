---
criterion: ac12
status: pass
method: browser_probe
---
# Mevcut işlevsellik regresyonsuz

Playwright, production build, 1440x900:

    SSS akordeonu : 10 <details>, ilkine tıklandı -> open false→true  ✔
    Video modalı  : galeri kartına tıklandı, <video> açıldı,
                    kaynak ".../saha-roket-firlatma-01.mp4" bağlandı   ✔
    Klavye        : 14 Tab adımı, 14'ünde de görünür odak halkası     ✔
    Menü hedefleri: #esik #telemetri #hangarlar #atolye #miras
                    #sss #iletisim — hepsi DOM'da                      ✔
    İletişim      : WhatsApp / Instagram / Google Maps kartları,
                    tel: ve mailto: bağlantıları yerinde               ✔
    Konsol hatası : 0
    Yatay taşma   : yok (masaüstü ve mobil)

Metin gövdesi 8805 karakter — dünya katmanı öncesiyle aynı.
