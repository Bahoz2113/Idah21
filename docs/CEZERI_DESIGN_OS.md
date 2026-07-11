# CEZERİ DESIGN OPERATING SYSTEM

> Bu dosya tüm CEZERİ ROBOTECH projelerinin **tasarım hafızasıdır**.
> Yeni bir proje başladığında önce bu dosya okunur, tasarım buna göre üretilir.
> Amaç: her CEZERİ ürünü "premium bir AI teknoloji şirketinin ürünü" hissi versin.

---

## 1. Brand DNA

Logo karakteri: **robotik baykuş**. Temsil ettikleri:
bilgelik · gözlem · yapay zeka · stratejik zeka · mühendislik · hassasiyet · koruyucu teknoloji · gelecek vizyonu.

İlham (kopya değil, sentez): Apple, OpenAI, Linear, Raycast, Vercel, Arc, Notion, Tesla UI, Nothing OS.

His: Premium · Yapay zeka · Robotik · Mühendislik · Güven · Minimalizm · Gelecek · Kurumsal kalite.

Arayüz: keskin ama agresif olmayan geometrik çizgiler, yumuşak kartlar, kontrollü mavi ışık.

---

## 2. Color Tokens

| Rol | Token | Hex |
|---|---|---|
| Primary Blue | `mavi` | `#2B6EA8` |
| Primary Light | `turkuaz` | `#63B6F2` |
| Primary Dark | `lacivert` | `#173A58` |
| Accent Amber | `vurgu` | `#F2A531` |
| Accent Dark | `vurguKoyu` | `#C97A16` |
| Background Light | `bgLight` | `#F8FAFC` |
| Surface | `surface` | `#FFFFFF` |
| Secondary Surface | `surface2` | `#F4F7FA` |
| Border | `borderc` | `#E7EDF4` |
| Text Primary | `textPrimary` | `#0F172A` |
| Text Secondary | `textSecondary` | `#64748B` |
| Text Muted | `textMuted` | `#94A3B8` |
| Dark Background | `darkBg` | `#0F1720` |
| Dark Surface | `darkSurface` | `#172231` |
| Dark Text 2 | `darkText2` | `#A8B3C2` |
| Success | `success` | `#2FBF71` |
| Warning | `warning` | `#FFB020` |
| Danger | `danger` | `#F04438` |
| Info | `info` | `#3297FF` |

Kaynak: `packages/config/src/tokens.ts` — tek gerçek kaynak (single source of truth).

---

## 3. Typography

- Font: **Inter** (alternatif: SF Pro / Manrope).
- Ağırlıklar: 400 / 500 / 600 / 700.
- Başlıklar güçlü, net, kısa. Paragraflar kısa ve okunabilir.
- Uzun metin bloklarından kaçın; kullanıcıyı yorma.

---

## 4. Spacing & Layout

- Ferah ekran, büyük boşluklar, net hiyerarşi.
- Her ekranda **tek ana aksiyon** öne çıkar.
- Kart grupları mantıklı ayrılır; gereksiz metin azaltılır.
- Sayfa konteyneri: `max-w-3xl` / `max-w-5xl`, `mx-auto`, `p-4 sm:p-6`.

---

## 5. Radius

| Kullanım | Değer |
|---|---|
| Küçük bileşen | 12–16px |
| Ana standart | 20px |
| Büyük kart | 24px |

Tailwind: `rounded-sm(12) / rounded-md(16) / rounded-lg(20) / rounded-xl(24)`.

---

## 6. Shadows

Çok hafif, premium, neredeyse görünmez.
`shadow-czr-xs / -sm / -md / -lg`. AI aura için `shadow-glow` (mavi).

---

## 7. Gradients

Sadece bu aileler; agresif/neon YASAK:
- Primary: `#2B6EA8 → #63B6F2` (`bg-gradient-primary`)
- Dark Tech: `#173A58 → #2B6EA8` (`bg-gradient-darktech`)
- Accent: `#F2A531 → #FFCC66` (`bg-gradient-accent`)
- Glass: `rgba(255,255,255,.08) → .03` (`bg-gradient-glass`)

Kural: yazı arkasında yoğun gradient YOK; bir ekranda 2'den fazla belirgin gradient YOK.

---

## 8. Motion

- Standart: **250ms**, `easeOutCubic` (`ease-czr`).
- İzin: fade, hafif scale, slide-up, hover-lift, soft glow.
- Yasak: zıplama, agresif hareket, abartılı loading, oyun efekti.
- Hazır: `animate-fade-up`, `animate-soft-glow`.

---

## 9. Component Rules

Reusable bileşenler `apps/web/src/components/ui/` altında. Her biri: light+dark, responsive, erişilebilir, aynı token'ları kullanır.
Çekirdek set: Button, Input, Select, Card, MetricCard, InsightCard, GlassCard, Badge, Tabs, Modal, Toast, EmptyState, Skeleton, AIChatBox.

---

## 10. Navigation

- Desktop: floating sidebar, ikon ağırlıklı, yuvarlatılmış. Seçili: soft blue bg + hafif glow + ince border + amber işaret.
- Mobile: floating bottom navigation, tek elle kullanım, touch target ≥ 44px.

---

## 11. Dark Mode

Siyah DEĞİL — deep blue-gray. Bg `#0F1720`, kart `#172231`, metin `#FFFFFF`, ikincil `#A8B3C2`, border `rgba(255,255,255,.08)`, AI glow `rgba(99,182,242,.18)`.
Aktivasyon: `<html class="dark">`.

---

## 12. AI Design Language

AI alanları: soft blue glow + hafif glass card + ince animasyon. Mor/yeşil/pembe neon YOK.
His: "Bu sistem beni yönlendiriyor ama beni yormuyor."

---

## 13. Tables & Forms

- Tablo: geniş satır, hover, rounded/card-table, sticky header (gerekirse), görünür sade arama+filtre, mobilde karta dönüşür.
- Form: mantıklı gruplar, net hata, focus'ta soft blue glow, sade placeholder, okunur label, net primary action, uzun formda stepper.

---

## 14. Accessibility

Yeterli kontrast, klavye kullanımı, focus state, ARIA label, screen reader uyumu, ≥44px dokunma alanı, anlaşılır hata gösterimi.

---

## 15. Responsive

Breakpoint: Mobile 390 · Tablet 768–1024 · Desktop 1280–1440+.
Mobil öncelikli; desktop'ta geniş boşluk; tablet'te iki kolon dengesi.

---

## 16. Do / Don't

**Do:** ferah düzen, tek ana aksiyon, hafif gölge, kontrollü mavi ışık, token kullan.
**Don't:** Material/Bootstrap görünümü, kalabalık ekran, yoğun gölge/border/ikon, fazla renk, neon gradient, yazı arkası yoğun gradient.

---

## 17. Future Project Usage

1. Bu dosyayı oku.
2. `tokens.ts`'i kopyala/uyarla (tek kaynak).
3. Tailwind/theme config'e token'ları bağla.
4. UI bileşenlerini bu kurallarla üret.
5. Yeni her UI kararını buraya işle.

_Son güncelleme: CZR CEOS tasarım sistemi kurulumu._
