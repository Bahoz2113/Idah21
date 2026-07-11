# GÖREV: CEZERİ Education OS — Kimlik Sistemi v5 (FİNAL — TOTP)
# Admin: Authenticator App (TOTP) · Eğitmen/Veli: Davet Linki + Şifre

> Claude Code uygulama görevi. Repo desenlerine göre yazıldı (curriculum.ts referans):
> `permissionProcedure("izin:eylem")`, `ctx.prisma.$queryRaw/$executeRaw` RAW SQL,
> `gen_random_uuid()::text`, `deletedAt` soft delete, HER SORGUDA `"organizationId"`.
> ÖNCEKİ v1–v4 DOSYALARINI YOK SAY. Twilio/SMS YOK — Türkiye kısıtı nedeniyle iptal.
> Admin doğrulaması: Google Authenticator / Microsoft Authenticator (TOTP, RFC 6238).

---

## 0. CLAUDE CODE'A İLK ADIM — keşif

Uygulamadan önce OKU, şablonları gerçeğe göre düzelt (iş kurallarına dokunma):
1. `packages/api/src/trpc.ts` → `publicProcedure` var mı? `permissionProcedure` kuruluşu?
   `ctx.user` nasıl doluyor (session/JWT)? Session ÜRETİMİ nerede yapılıyor?
2. Mevcut login akışı hangi dosyada?
3. İzin haritası nerede? → `invitation:read`, `invitation:write` eklenecek.
4. `users` tablosunun gerçek kolonları + mevcut organizasyonun id'si
   (`SELECT id FROM organizations LIMIT 5;` — birden çok org varsa Hadi'ye tek soru sor).

---

## 1. İŞ KURALLARI (DEĞİŞMEZ)

### 1.1 Admin — SADECE bu 3 kişi, SADECE authenticator kodu ile giriş
| Ad | Telefon (kimlik anahtarı) | E.164 |
|---|---|---|
| Hadi TANSIK | 05477727221 | +905477727221 |
| Cihat EREN | 05530844643 | +905530844643 |
| Metin ÖZER | 05356636033 | +905356636033 |

- Telefon numarası ŞİFRE DEĞİL, KİMLİK anahtarıdır: giriş = telefon + authenticator'daki
  6 haneli kod (30 sn'de bir yenilenir).
- Adminlerin şifresi YOKTUR (passwordHash NULL). TOTP secret'ları DB'de DEĞİL, yalnız
  ENV'de tutulur (sızıntı yüzeyi minimum; rotasyon = env değişikliği).
- Whitelist dışı telefon için kod doğrulaması HİÇ çalıştırılmaz; hata generic.

### 1.2 Eğitmen/Veli — SADECE adminin davet linkiyle hesap açar (v4 ile aynı)
- Public kayıt YOK. Link tek kullanımlık, 7 gün, rol token'da sabit (TEACHER/PARENT).
- Davet, üreten adminin `organizationId`'sini taşır. Sonraki girişler telefon + şifre.
- Veli davetine öğrenci ID'leri gömülebilir → otomatik eşleşme.

---

## 2. BAĞIMLILIKLAR + ENV

```
pnpm add otplib --filter <api paketi>
pnpm add -D qrcode @types/qrcode --filter <api paketi>   # yalnız kurulum scripti için
```

`.env` (Vercel Production+Preview'a da aynen):
```
ADMIN_PHONE_WHITELIST=+905477727221,+905530844643,+905356636033
INVITE_BASE_URL=https://<uygulama-domaini>

# scripts/generate-admin-totp.ts çıktısıyla doldurulacak (base32):
ADMIN_TOTP_905477727221=
ADMIN_TOTP_905530844643=
ADMIN_TOTP_905356636033=
```
> Secret'lar YALNIZ server-side. NEXT_PUBLIC_ öneki ASLA. Git'e commit ETME (.env zaten
> .gitignore'da olmalı — doğrula).

`packages/api/src/lib/admin.ts`:
```ts
export const ADMIN_PHONES: ReadonlySet<string> = new Set(
  (process.env.ADMIN_PHONE_WHITELIST ?? "").split(",").map(s => s.trim()).filter(Boolean)
);
export const isAdminPhone = (p: string) => ADMIN_PHONES.has(p);

/** +905477727221 → env anahtarı ADMIN_TOTP_905477727221 */
export const totpSecretFor = (phoneE164: string): string | null =>
  process.env[`ADMIN_TOTP_${phoneE164.replace("+", "")}`] ?? null;

export const ADMIN_NAMES: Record<string, string> = {
  "+905477727221": "Hadi TANSIK",
  "+905530844643": "Cihat EREN",
  "+905356636033": "Metin ÖZER",
};
```

`packages/api/src/lib/phone.ts`:
```ts
/** 05xx / 5xx / +905xx / 905xx → +905xxxxxxxxx */
export function normalizePhoneTR(raw: string): string | null {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.length === 10 && d.startsWith("5") ? `+90${d}` : null;
}
```

---

## 3. KURULUM SCRIPT'İ — secret + QR üretimi (tek seferlik)

`scripts/generate-admin-totp.ts`:
```ts
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "fs";

const ADMINS = [
  { name: "Hadi TANSIK", phone: "+905477727221" },
  { name: "Cihat EREN",  phone: "+905530844643" },
  { name: "Metin ÖZER",  phone: "+905356636033" },
];

mkdirSync("totp-setup", { recursive: true });
const envLines: string[] = [];

for (const a of ADMINS) {
  const secret = authenticator.generateSecret(); // base32
  const otpauth = authenticator.keyuri(a.phone, "CEZERI Egitim OS", secret);
  const file = `totp-setup/${a.phone.replace("+", "")}.png`;
  await QRCode.toFile(file, otpauth, { width: 360 });
  envLines.push(`ADMIN_TOTP_${a.phone.replace("+", "")}=${secret}`);
  console.log(`${a.name}: QR → ${file}`);
}
writeFileSync("totp-setup/env-ekle.txt", envLines.join("\n") + "\n");
console.log("\nenv satırları → totp-setup/env-ekle.txt");
console.log("UYARI: totp-setup/ klasörünü .gitignore'a ekle, dağıtım bitince SİL.");
```
Çalıştır: `pnpm tsx scripts/generate-admin-totp.ts`
- `totp-setup/` içinde kişi başı 1 QR PNG + `env-ekle.txt` oluşur.
- `env-ekle.txt` satırları `.env`'e ve Vercel env'e yapıştırılır.
- QR dağıtımı: Hadi kendi QR'ını okutur; Cihat/Metin'inkini YÜZ YÜZE veya süreli/silinen
  mesajla iletir (QR = anahtar; herkese açık kanala atılmaz). Okutma bitince klasör silinir.
- `.gitignore`'a `totp-setup/` eklenir.

Uygulama: Google Authenticator / Microsoft Authenticator / Aegis → "QR tara" →
"CEZERI Egitim OS (+9054...)" hesabı eklenir, 30 sn'lik 6 haneli kod üretmeye başlar.

---

## 4. SQL — invitations + totp replay tablosu

```sql
-- v4 ile aynı: invitations
CREATE TABLE IF NOT EXISTS invitations (
  id               text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "organizationId" text NOT NULL,
  token            text NOT NULL UNIQUE,
  role             text NOT NULL CHECK (role IN ('TEACHER','PARENT')),
  phone            text,
  "studentIds"     text[] NOT NULL DEFAULT '{}',
  note             text,
  "createdBy"      text NOT NULL,
  "expiresAt"      timestamptz NOT NULL,
  "usedAt"         timestamptz,
  "usedBy"         text,
  "createdAt"      timestamptz NOT NULL DEFAULT now(),
  "deletedAt"      timestamptz
);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_org   ON invitations("organizationId");
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- YENİ: aynı TOTP kodunun 30 sn penceresinde iki kez kullanılmasını engelle (replay koruması)
CREATE TABLE IF NOT EXISTS admin_totp_state (
  phone      text PRIMARY KEY,          -- E.164
  "lastStep" bigint NOT NULL DEFAULT 0, -- kullanılan son zaman adımı (unix/30)
  "failCount" int NOT NULL DEFAULT 0,   -- ardışık yanlış deneme
  "lockedUntil" timestamptz             -- brute force kilidi
);
ALTER TABLE admin_totp_state ENABLE ROW LEVEL SECURITY;

-- users uyumu (kolon adlarını 0. adımda doğrula):
ALTER TABLE users ALTER COLUMN "passwordHash" DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE "deletedAt" IS NULL;
```

---

## 5. ROUTER — adminAuth (TOTP)

`packages/api/src/routers/adminAuth.ts`:
```ts
import { z } from "zod";
import { authenticator } from "otplib";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { normalizePhoneTR } from "../lib/phone";
import { isAdminPhone, totpSecretFor, ADMIN_NAMES } from "../lib/admin";

authenticator.options = { window: 1 }; // saat kayması toleransı: ±30 sn

const MAX_FAILS = 5;           // ardışık 5 yanlış → kilit
const LOCK_MINUTES = 10;

export const adminAuthRouter = router({

  // TEK ADIM: telefon + authenticator kodu → session
  login: publicProcedure
    .input(z.object({ phone: z.string(), code: z.string().length(6).regex(/^\d{6}$/) }))
    .mutation(async ({ ctx, input }) => {
      const fail = () =>
        new TRPCError({ code: "UNAUTHORIZED", message: "Telefon veya kod hatalı" });

      const phone = normalizePhoneTR(input.phone);
      if (!phone || !isAdminPhone(phone)) throw fail(); // generic — numara sızdırma yok

      const secret = totpSecretFor(phone);
      if (!secret) {
        console.error(`TOTP secret env'de yok: ${phone}`);
        throw fail();
      }

      // Kilit + replay durumu
      const st = await ctx.prisma.$queryRaw<any[]>`
        SELECT "lastStep", "failCount", "lockedUntil" FROM admin_totp_state
        WHERE phone = ${phone} LIMIT 1
      `;
      const state = st[0] ?? { lastStep: 0, failCount: 0, lockedUntil: null };
      if (state.lockedUntil && new Date(state.lockedUntil) > new Date())
        throw new TRPCError({ code: "TOO_MANY_REQUESTS",
          message: "Çok fazla yanlış deneme. 10 dk sonra tekrar deneyin." });

      const currentStep = Math.floor(Date.now() / 30000);
      const valid = authenticator.verify({ token: input.code, secret });

      if (!valid) {
        const fails = Number(state.failCount) + 1;
        await ctx.prisma.$executeRaw`
          INSERT INTO admin_totp_state (phone, "lastStep", "failCount", "lockedUntil")
          VALUES (${phone}, ${state.lastStep ?? 0}, ${fails},
                  ${fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MINUTES * 60000) : null})
          ON CONFLICT (phone) DO UPDATE SET
            "failCount" = ${fails},
            "lockedUntil" = ${fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MINUTES * 60000) : null}
        `;
        throw fail();
      }

      // REPLAY koruması: aynı/eski adımın kodu ikinci kez kabul edilmez
      if (currentStep <= Number(state.lastStep)) throw fail();

      await ctx.prisma.$executeRaw`
        INSERT INTO admin_totp_state (phone, "lastStep", "failCount", "lockedUntil")
        VALUES (${phone}, ${currentStep}, 0, NULL)
        ON CONFLICT (phone) DO UPDATE SET
          "lastStep" = ${currentStep}, "failCount" = 0, "lockedUntil" = NULL
      `;

      // Admin kullanıcıyı garanti et (ilk girişte otomatik oluşur)
      const rows = await ctx.prisma.$queryRaw<any[]>`
        SELECT id FROM users WHERE phone = ${phone} AND "deletedAt" IS NULL LIMIT 1
      `;
      let userId: string;
      if (rows.length === 0) {
        const created = await ctx.prisma.$queryRaw<any[]>`
          INSERT INTO users (id, phone, "fullName", role, "organizationId", "createdAt")
          VALUES (gen_random_uuid()::text, ${phone}, ${ADMIN_NAMES[phone] ?? "Admin"},
                  'ADMIN', ${/* ORG_ID: 0. adım bulgusu */ ctx.defaultOrganizationId}, now())
          RETURNING id
        `;
        userId = created[0].id;
      } else {
        userId = rows[0].id;
        await ctx.prisma.$executeRaw`
          UPDATE users SET role = 'ADMIN', "updatedAt" = now() WHERE id = ${userId}
        `;
      }

      // SESSION: repodaki mevcut mekanizmayla üret (0. adım bulgusu) → /admin
      return { ok: true, userId };
    }),
});
```

**Savunma hattı (permissionProcedure içine):**
```ts
if (ctx.user.role === "ADMIN" && !isAdminPhone(ctx.user.phone))
  throw new TRPCError({ code: "FORBIDDEN" }); // DB'de sahte ADMIN olsa bile çalışamaz
```

---

## 6. ROUTER — invitation (v4 İLE BİREBİR AYNI)

- **create** `permissionProcedure("invitation:write")`: role TEACHER|PARENT, opsiyonel
  phone kilidi, veli için studentIds, not; `randomBytes(32).toString("hex")` token;
  `"expiresAt" = now() + interval '7 days'`; org = `ctx.user.organizationId`;
  dönen `${INVITE_BASE_URL}/davet/${token}`.
- **validate** (public): token + `"usedAt" IS NULL` + `"deletedAt" IS NULL` + süre.
- **accept** (public, `$transaction`): token ATOMİK tüketilir
  (`UPDATE ... SET "usedAt"=now() WHERE ... RETURNING` — race kapalı);
  `isAdminPhone(phone)` → RED; kullanıcı `i.organizationId`'ye açılır (rol token'dan);
  PARENT ise öğrenci eşleme (gerçek ilişki tablosunu 0. adımda bul); `"usedBy"` yazılır.
- **list / revoke** `permissionProcedure("invitation:read"/"invitation:write")` — org kapsamlı,
  revoke = soft delete (`"deletedAt" = now()`, yalnız kullanılmamış davetler).

Root router'a ekle: `adminAuth: adminAuthRouter, invitation: invitationRouter`.
İzin haritasına ekle: `invitation:read`, `invitation:write` (yalnız ADMIN).

---

## 7. EĞİTMEN/VELİ LOGIN (mevcut mutation'a iki kural)

```ts
if (!user.passwordHash || user.role === "ADMIN")
  throw new TRPCError({ code: "UNAUTHORIZED", message: "Yönetici girişi doğrulama koduyla yapılır" });
// hata mesajları hep generic: "Telefon veya şifre hatalı"
```

---

## 8. UI (repo deseni: "use client", trpc from "@cezeri/trpc", Tailwind, text-lacivert)

### 8.1 Giriş sayfası — iki sekme
- **Yönetici Girişi** (TEK adım — "kod gönder" YOK):
  Telefon (`inputmode="tel"`) + "Doğrulama kodu" 6 hane (`inputmode="numeric"`,
  `autocomplete="one-time-code"`) → "Giriş" (`adminAuth.login`) → /admin.
  Alt not: "Kodu Google/Microsoft Authenticator uygulamanızdan okuyun."
- **Eğitmen / Veli Girişi**: Telefon + şifre → /ogretmen veya /veli.
  "Kayıt ol" YOK; not: "Hesabınız yoksa kurumunuzdan davet linki isteyin."
- Mobile-first: tek kolon, input font-size ≥16px (iOS zoom).

### 8.2 `apps/web/src/app/davet/[token]/page.tsx` (public) — v4 ile aynı
- validate → geçersizse hata; geçerliyse Ad Soyad + Telefon (kilitliyse readonly) +
  Şifre ×2 → accept → otomatik giriş → panel. `robots: { index: false }`, no-referrer.

### 8.3 `apps/web/src/app/admin/davetler/page.tsx` — v4 ile aynı
- Müfredat sayfası kalıbı: üstte form kartı, altta liste.
- Link kartı: Kopyala + WhatsApp'ta Paylaş. Tablo: rol, not, durum, İptal.

---

## 9. GÜVENLİK KONTROL LİSTESİ (Verifier)

- [ ] TOTP secret'lar YALNIZ env'de; DB'de, logda, client bundle'da YOK
- [ ] `totp-setup/` .gitignore'da; QR dağıtımı bitince klasör silindi
- [ ] Replay koruması: aynı kod 30 sn penceresinde ikinci kez kabul edilmiyor (lastStep)
- [ ] Brute force: 5 ardışık yanlış → 10 dk kilit (admin_totp_state)
- [ ] `window: 1` (±30 sn) — daha geniş DEĞİL
- [ ] Whitelist dışı telefon için TOTP doğrulaması hiç çalışmıyor; hata generic
- [ ] permissionProcedure'da whitelist savunma hattı aktif
- [ ] Adminlerde passwordHash NULL; şifre girişi ADMIN için kapalı
- [ ] invitations: her admin sorgusu org kapsamlı; token atomik tüketiliyor
- [ ] ADMIN rolü davetle verilemez (CHECK + kod çift kilit)
- [ ] RLS: invitations + admin_totp_state aktif (16 tablodaki desen)
- [ ] /davet/[token] noindex + no-referrer; login hataları bilgi sızdırmıyor
- [ ] login + accept mutation'larına IP bazlı ek rate limit

---

## 10. UYGULAMA SIRASI

1. Keşif (0. bölüm): trpc.ts, mevcut login/session, izin haritası, users kolonları, org id
2. `pnpm add otplib` (+dev: qrcode) + env şablonu + lib/ (admin, phone)
3. SQL: invitations + admin_totp_state + users uyumu
4. `scripts/generate-admin-totp.ts` → QR'lar + env-ekle.txt → env'lere yapıştır
5. adminAuthRouter (login) + session bağlantısı + permissionProcedure savunma hattı
6. invitationRouter + izin haritası
7. Login mutation kuralları
8. UI: giriş (iki sekme) + /davet/[token] + /admin/davetler
9. 3 admin QR okutma (Hadi dağıtır) → uçtan uca test → Vercel env → deploy

## 11. FELAKET SENARYOLARI (bilinsin)

- **Telefon kaybı/değişimi:** İlgili adminin env satırı silinir → script yeniden çalıştırılıp
  yalnız o kişiye yeni secret üretilir → yeni QR okutulur. Diğer adminler etkilenmez.
- **Secret sızıntısı şüphesi:** Aynı prosedür — env değiştir, deploy, eski kodlar anında ölür.
- **Saat kayması:** Authenticator uygulamaları NTP ile senkron; window:1 toleransı yeterli.
