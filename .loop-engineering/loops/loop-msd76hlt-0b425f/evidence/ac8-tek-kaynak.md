# AC8 — İçerik tek kaynaktan DOM'a ve schema'ya besleniyor
status: pass
verified_at: 2026-08-03T12:54:31Z
method: file_check

## 10 disiplin başlığı hem DOM'da hem Course schema'sında
```
DOM+SCHEMA  İHA / VTOL Sistemleri
DOM+SCHEMA  Roketçilik ve İtki
DOM+SCHEMA  Yapay Zeka ve Makine Öğrenmesi
DOM+SCHEMA  Robotik ve Otonom Sistemler
DOM+SCHEMA  3D Tasarım ve Eklemeli Üretim
DOM+SCHEMA  Yazılım ve Algoritma
DOM+SCHEMA  Elektronik ve Mekatronik
DOM+SCHEMA  Siber Güvenlik Farkındalığı
DOM+SCHEMA  Uzay ve Havacılık Bilimleri
DOM+SCHEMA  Teknoloji Girişimciliği
```

## 10 SSS sorusu hem DOM'da hem FAQPage schema'sında
```
10/10 soru DOM ile schema arasında birebir eşleşiyor
10/10 cevap metni DOM'da mevcut (JS kapalıyken de taranabilir)
```

Kaynak: `apps/web/src/lib/seo/site.ts` — hem bileşenler hem `schema.ts` buradan okur.
