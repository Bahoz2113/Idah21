# Gerçek Medya Varlıkları

Bu dizin, CEZERİ ROBOTECH'in Batman atölyesinde ve sahada çekilmiş **gerçek**
fotoğraf ve videolarını barındırır. Galeri içeriği
`apps/web/src/lib/media/real-media.ts` manifest'inden okunur — dosyayı buraya
koymak yetmez, manifest'e kayıt eklenmelidir.

> **Yapay zeka ile üretilmiş marka görselleri buraya KONMAZ.**
> Onlar `public/assets/brand/` altındadır. Ayrım kasıtlıdır: sayfa
> "gerçek atölye deneyimi" vaat ediyor, üretilmiş görseller o vaadin
> kanıtı olarak sunulamaz.

## Mevcut envanter (11 varlık)

| Dosya | Tür | Süre | Kategori | Span |
|---|---|---|---|---|
| `saha-roket-firlatma-01` | video | 11 sn | saha | hero |
| `saha-roket-mizrak-01` | video | 6 sn | saha | normal |
| `saha-hava-cekimi-01` | video | 9 sn | saha | wide |
| `saha-roket-ekip-01` | foto | — | saha | normal |
| `saha-iha-simurgh-01` | video | 10 sn | drone | wide |
| `ekip-iha-takim-01` | foto | — | drone | normal |
| `atolye-iha-uretim-01` | video | 11 sn | atolye | tall |
| `atolye-tur-01` | video | 11 sn | atolye | wide |
| `atolye-ldr-dersi-01` | foto | — | atolye | tall |
| `ekip-egitmenler-01` | foto | — | ekip | normal |
| `etkinlik-avm-standi-01` | foto | — | ekip | normal |

Her videonun yanında `<ad>-poster.webp` bulunur. Galeri kartı **yalnızca
posteri** yükler; video dosyası kullanıcı kartı açtığında indirilir.

## Hâlâ eksik olanlar

Manifest'teki `3d-baski` ve `robotik` kategorileri şu an boş — filtre listesi
manifest'ten türetildiği için bu kategoriler arayüzde görünmüyor. Şunlar
gelirse otomatik açılırlar:

| İhtiyaç | Kategori |
|---|---|
| 3D yazıcı **çalışırken** yakın çekim (baskı sürerken) | `3d-baski` |
| Bitmiş 3D baskı parçasının ölçülmesi / montajı | `3d-baski` |
| Çizgi izleyen robot testi, robot yarışı | `robotik` |
| Öğrencinin robot kolu / paletli robot programlaması | `robotik` |

## Teknik gereksinimler

**Fotoğraf**
- Format: `.webp` (tercih) veya `.jpg`
- Uzun kenar: en az **1600 px**
- Tek dosya ≤ 400 KB (WebP kalite ~80)
- `width`/`height` manifest'e **gerçek değeriyle** yazılmalı

**Video**
- Format: `.mp4` (H.264)
- Süre: **6-15 saniye** — daha uzunsa en iyi bölümü kesin
- Her videonun **poster görseli zorunlu**: `<ad>-poster.webp`
- Hedef boyut: ≤ 1.5 MB

### Gömülü metin uyarısı

Instagram story/reel'den gelen kayıtlarda üste veya alta gömülü yazı olur
("Kayıtlar devam ediyor", altyazı bantları). Bunlar sitede amatör durur ve
kırpılmaları gerekir — kırpma da kadrajı daraltır. **Mümkünse yazısız ham
kayıtları gönderin.** Mevcut envanterde `atolye-iha-uretim-01` ve
`atolye-ldr-dersi-01` bu sebeple kırpıldı.

## KVKK / veli rızası

Çocukların yüzünün göründüğü her kare için **veli açık rızası** alınmış
olmalıdır. Rıza alınmamış çocukların bulunduğu kareler kullanılmamalı veya
yüzler tanınmayacak şekilde kadrajlanmalıdır. Bu kontrol kurum
sorumluluğundadır; manifest'e eklenen her varlık rızalı kabul edilir.

## Kayıt ekleme

```ts
// apps/web/src/lib/media/real-media.ts
{
  kind: "video",
  id: "3d-baski-uretim-01",
  src: "/assets/real-media/3d-baski-uretim-01.mp4",
  poster: "/assets/real-media/3d-baski-uretim-01-poster.webp",
  alt: "Batman CEZERİ ROBOTECH atölyesinde 3D yazıcıyla parça üreten öğrenci",
  caption: "3D baskı istasyonu",
  category: "3d-baski",
  span: "wide",
  width: 640, height: 1138,
  posterWidth: 800, posterHeight: 1422,
  durationSec: 9,
}
```

### `alt` metni yazarken

`alt`, görsel aramanın ve AI indekslemesinin taşıyıcısıdır:
- Ne yapıldığını **fiil ile** anlat ("monte eden", "test eden")
- **Batman** ve **CEZERİ ROBOTECH** geçsin
- Dosya adını tekrar etme, "resim/fotoğraf" yazma
- 8-16 kelime yeterli
