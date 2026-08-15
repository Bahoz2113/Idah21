---
criterion: ac3
status: pass
method: file_check + screenshot
revised: 2026-08-09
---
# Wordmark dünyanın içinde, ön plan tarafından örtülüyor

> REVİZYON NOTU — DÜRÜSTLÜK KAYDI.
> Dünya boyalı katmanlara geçerken `HangarWorld` sahneden çıktı ve
> wordmark düzlemi onunla birlikte gitti. Bu kriter bir süre KARŞILANMADI
> ve doğrulayıcı 2026-08-09'da haklı olarak FAIL verdi. Aşağıdaki kanıt,
> düzlemin yeni mimariye taşınmasından sonra alınmıştır.

## Nerede duruyor

`world/Wordmark.tsx` — `CEZERÎ` canvas dokusuyla çizilmiş bir düzlem,
`FxCanvas` içinde:

    position [3.5, BASE_Y, -7]    BASE_Y = -0.95
    scale    [13.5, 3.4, 1]
    material meshBasicMaterial, transparent, depthWrite=false

Harfler içi boş çizilir (kontur `rgba(207,227,230,0.9)`, dolgu 0.08);
dolu bir blok arkasındaki sahneyi kapatırdı. Font indirmesi yok, FOUT yok.

## Occlusion neden gerçek

Katman sırası:

    boyalı katmanlar    z-0 … z-2    gök / hangar / apron
    WebGL sahnesi       z-3          wordmark burada
    bölüm içeriği       z-10         manşet, gövde metni, kartlar
    ön plan siluetleri  z-20         makine sırtı — harflerin ÖNÜNDEN geçer

Ön plan (`.czr-foreground`) `.czr-world` kapsayıcısının DIŞINDA, sayfa
düzeyinde kardeş olarak durur; kapsayıcı `z-0` + `contain: layout paint`
taşıdığı için orada kalsaydı içeriğin üstüne çıkamazdı.

Örten şey bir CSS maskesi değil: `sahne-onplan-serit.webp` gerçek alfa
kanalı taşır (üst satır alfa max = 0, alt satır alfa min = 255), yani
siluetin ŞEKLİ kesiyor.

## Harfler sırtın arkasına gömülüyor

Kamera scroll ile yükseliyor ama bu iniş için fazla yavaş kalıyordu;
düzlem kendi ekseninde de iner:

    mesh.position.y = BASE_Y - p * 26

Böylece p ≈ 0.09–0.14 arasında harflerin alt yarısı makine sırtının
arkasında kaybolurken üst yarısı dışarıda kalır.

Kanıt kareleri:
- `scratchpad/wm-p000.png` — eşik: harfler sağda, gövde metnini kesmiyor;
  `TASARLA.` manşeti `C` harfinin önünden geçiyor (DOM z-10 > canvas z-3)
- `scratchpad/wm-p009.png` — p ≈ 0.09: `CEZERİ`nin alt yarısı siluetin
  arkasında; paragraf metni tam okunur, ön planda

## Okunurluk kısıtı

Konum iki kısıtın kesişimi: yeterince aşağıda (ayakları sırta değsin)
ve sağda (hero'nun gövde metni sol kolonu tutuyor). Ortada duran bir
denemede harfler paragrafın arkasına giriyor ve okumayı yoruyordu; o
yerleşim reddedildi.

Söniş p = 0.20'de tamamlanır — kategori efektleri p = 0.12'den itibaren
aynı bölgeye giriyor, ikisi üst üste binmez.
