status: pass

# AC4 — Global policy bloğu marker'lı eklenir ve mevcut CLAUDE.md içeriğini korur

## Doğrulama yöntemi
Kurulumdan önce `~/.claude/CLAUDE.md` içine sahte bir "kullanıcı içeriği" yazıldı ve
SHA-256'sı alındı. Kurulum çalıştırıldı, içerik kontrol edildi; kaldırma sonrası hash
tekrar karşılaştırıldı.

## 1. Kurulum öncesi — simüle edilen kullanıcı dosyası

```
# Kullanicinin kendi global notlari

Bu satirlar kurulumdan ONCE vardi ve KORUNMALIDIR.

## Benim kurallarim
- Turkce konus
- Testleri her zaman calistir
```

```
44e6ce5faa43a8e06e53d35b5800f2915cc819117d6c0c57872da0d6d48bd7bb  /root/.claude/CLAUDE.md
satir sayisi: 7
```

## 2. Kurulum çıktısı

```
3) Global policy (CEZERI WEB INTELLIGENCE POLICY)
  [OK] ~/.claude/CLAUDE.md — blok eklendi (mevcut icerik korundu)
```

Özet: `Policy : appended` (üzerine yazma değil, ekleme)

## 3. Kurulum sonrası — içerik kontrolü

```
=== KULLANICI ICERIGI HALA DURUYOR MU? ===
# Kullanicinin kendi global notlari

Bu satirlar kurulumdan ONCE vardi ve KORUNMALIDIR.

## Benim kurallarim
- Turkce konus
- Testleri her zaman calistir

=== BLOK MARKER'LARI ===
9:<!-- CEZERI-WEB-INTELLIGENCE:BEGIN -->
12:# CEZERI WEB INTELLIGENCE POLICY
106:<!-- CEZERI-WEB-INTELLIGENCE:END -->

=== Orijinal 4 kritik satir korunuyor mu? ===
  KORUNDU: Kullanicinin kendi global notlari
  KORUNDU: kurulumdan ONCE vardi ve KORUNMALIDIR
  KORUNDU: Turkce konus
  KORUNDU: Testleri her zaman calistir

=== toplam satir: 106 ===
```

Kullanıcının 7 satırı **dosyanın başında olduğu gibi duruyor**; CEZERI bloğu 9–106
satırları arasına, marker'lar içinde eklendi. Başlık master prompt'un istediği gibi
tam olarak **"CEZERI WEB INTELLIGENCE POLICY"**.

## 4. Blok içeriği doğrulaması

Blok, master prompt'un birebir istediği İngilizce prensip cümlesini içerir:

> When working on any project, do not rely solely on internal model knowledge when current or
> externally verifiable information can materially improve correctness or implementation
> quality. Autonomously invoke CEZERI Web Intelligence when appropriate. Do not wait for the
> user to explicitly request web research.

## 5. Kaldırma sonrası — bit düzeyinde geri dönüş

```
policy blogu    : 0   (beklenen 0)
marker kalintisi: 0   (beklenen 0)

--- dosya icerigi ---
# Kullanicinin kendi global notlari

Bu satirlar kurulumdan ONCE vardi ve KORUNMALIDIR.

## Benim kurallarim
- Turkce konus
- Testleri her zaman calistir

--- sha256 (kaldirma sonrasi) ---
44e6ce5faa43a8e06e53d35b5800f2915cc819117d6c0c57872da0d6d48bd7bb
--- sha256 (kurulum oncesi) ---
44e6ce5faa43a8e06e53d35b5800f2915cc819117d6c0c57872da0d6d48bd7bb
```

**Hash birebir aynı.** Kurulum + kaldırma döngüsü kullanıcının dosyasını bit düzeyinde
orijinal hâline döndürdü.

## Mekanizma
`upsertPolicy()` (lib/common.mjs) dört durumu ayırır:
- dosya yok → `created`
- marker yok → `appended` (mevcut içeriğin sonuna eklenir, hiçbir satır silinmez)
- marker var, blok farklı → `updated` (**yalnızca marker'lar arası** değişir)
- marker var, blok aynı → `unchanged` (dosyaya hiç dokunulmaz)

Her yazma öncesi mevcut dosya `~/.claude/backups/cezeri-<zaman>/` altına yedeklenir.

## Sonuç
**PASS** — Blok marker'lı eklendi, başlık doğru, mevcut kullanıcı içeriği korundu,
kaldırma sonrası hash birebir orijinaline döndü.
