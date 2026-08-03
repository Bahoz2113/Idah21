# Gerçek Medya Varlıkları — Teslim Rehberi

Bu dizin, CEZERİ ROBOTECH'in Batman atölyesinde ve sahada çekilmiş **gerçek**
fotoğraf ve videolarını barındırır. Dosyalar buraya konur, ardından
`apps/web/src/lib/media/real-media.ts` içindeki `realMedia` dizisine kayıt
eklenir. Kayıt eklenmeden dosya galeride görünmez.

## Beklenen çekimler

| # | Dosya adı (öneri) | İçerik | Kategori | Önerilen span |
|---|---|---|---|---|
| 1 | `atolye-genel-01.webp` | Atölyenin geniş açılı genel görünümü, öğrenciler çalışırken | `atolye` | `hero` |
| 2 | `3d-baski-uretim-01.webp` | 3D yazıcı çalışırken, öğrenci parçayı incelerken | `3d-baski` | `wide` |
| 3 | `drone-montaj-01.webp` | Öğrenci İHA gövdesini/motorunu monte ederken | `drone` | `tall` |
| 4 | `drone-montaj-02.webp` | Uçuş kontrol kartı kalibrasyonu, yakın çekim | `drone` | `normal` |
| 5 | `saha-ucus-testi-01.mp4` | Saha uçuş testi, 4K, 8-15 sn | `saha` | `hero` |
| 6 | `saha-roket-firlatma-01.mp4` | Model roket fırlatma anı, 4K, 6-12 sn | `saha` | `wide` |
| 7 | `robotik-calisma-01.webp` | Robot montajı / çizgi izleyen robot testi | `robotik` | `normal` |
| 8 | `elektronik-lehim-01.webp` | Lehimleme / devre kurulumu yakın çekim | `atolye` | `normal` |
| 9 | `ekip-grup-01.webp` | Öğrenci grubu + eğitmen, atölye içinde | `ekip` | `wide` |
| 10 | `yapay-zeka-ders-01.webp` | Ekranda model eğitimi / kod yazan öğrenci | `atolye` | `normal` |

## Teknik gereksinimler

**Fotoğraf**
- Format: `.webp` (tercih) veya `.jpg`
- Uzun kenar: en az **1600 px**, ideal 2400 px
- Dosya boyutu: tek dosya ≤ 400 KB (WebP kalite ~80)
- En-boy oranı serbest — ancak `width`/`height` manifest'e **gerçek değeriyle** yazılmalı

**Video**
- Format: `.mp4` (H.264, yaygın uyumluluk) — istenirse ek `.webm`
- Çözünürlük: 1920×1080 yeterli; 4K kaynak varsa web için 1080p'ye indirilmeli
- Süre: **6-15 saniye** (galeri döngüsü için; uzun video modal'da oynatılır)
- Ses: galeri önizlemesi sessiz oynatır, ses modal'da açılır
- Her videonun **poster görseli zorunlu**: `<ad>-poster.webp`

## Gizlilik / KVKK uyarısı

Çocukların yüzünün göründüğü her kare için **veli açık rızası** alınmış olmalıdır.
Rıza alınmamış çocukların bulunduğu kareler kullanılmamalı veya yüzler
tanınmayacak şekilde kadrajlanmalıdır. Bu kontrol kurum sorumluluğundadır;
manifest'e eklenen her varlık rızalı kabul edilir.

## Kayıt ekleme

`apps/web/src/lib/media/real-media.ts`:

```ts
export const realMedia: readonly RealMediaItem[] = [
  {
    kind: "image",
    id: "atolye-genel-01",
    src: "/assets/real-media/atolye-genel-01.webp",
    alt: "Batman CEZERİ ROBOTECH atölyesinde robotik kodlama çalışması yapan öğrenciler",
    caption: "Atölye — genel görünüm",
    category: "atolye",
    span: "hero",
    width: 2400,
    height: 1600,
  },
  {
    kind: "video",
    id: "saha-ucus-testi-01",
    src: "/assets/real-media/saha-ucus-testi-01.mp4",
    poster: "/assets/real-media/saha-ucus-testi-01-poster.webp",
    alt: "CEZERİ ROBOTECH öğrencilerinin Batman'da gerçekleştirdiği İHA saha uçuş testi",
    caption: "Saha uçuş testi",
    category: "saha",
    span: "hero",
    durationSec: 12,
    width: 1920,
    height: 1080,
  },
];
```

### `alt` metni yazarken

`alt`, görsel aramanın ve AI indekslemesinin taşıyıcısıdır. Kural:
- Ne yapıldığını **fiil ile** anlat ("monte eden", "test eden")
- **Batman** ve **CEZERİ ROBOTECH** geçsin
- Dosya adını tekrar etme, "resim/fotoğraf" yazma
- 8-16 kelime yeterli
