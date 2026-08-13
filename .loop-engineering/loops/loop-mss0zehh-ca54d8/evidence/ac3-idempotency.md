status: pass

# AC3 — install.mjs idempotent: ikinci çalıştırmada hiçbir dosya değişmiyor

## Doğrulama yöntemi
Kurulum arka arkaya çalıştırıldı; özet satırındaki `Degisiklik` sayacı ve her adımın
`created / updated / unchanged` etiketi karşılaştırıldı.

## 1. çalıştırma — temiz sistem

```
2) Skill'ler
  [OK] cezeri-orchestrator (olusturuldu)
  [OK] cezeri-web-research (olusturuldu)
  [OK] cezeri-browser-agent (olusturuldu)
  [OK] cezeri-article-reader (olusturuldu)
  [OK] cezeri-documentation-reader (olusturuldu)
  [OK] cezeri-web-extractor (olusturuldu)
  [OK] cezeri-source-verifier (olusturuldu)
  [OK] cezeri-deep-research (olusturuldu)

3) Global policy (CEZERI WEB INTELLIGENCE POLICY)
  [OK] ~/.claude/CLAUDE.md — blok eklendi (mevcut icerik korundu)

4) Playwright MCP
  [OK] "playwright" user scope'a eklendi

OZET
  Policy      : appended
  MCP         : added
  Degisiklik  : 10
```
Çıkış kodu: `0`

## 2. çalıştırma — hiçbir şey değiştirilmeden hemen sonra

```
2) Skill'ler
  [ATLA] cezeri-orchestrator (degismedi)
  [ATLA] cezeri-web-research (degismedi)
  [ATLA] cezeri-browser-agent (degismedi)
  [ATLA] cezeri-article-reader (degismedi)
  [ATLA] cezeri-documentation-reader (degismedi)
  [ATLA] cezeri-web-extractor (degismedi)
  [ATLA] cezeri-source-verifier (degismedi)
  [ATLA] cezeri-deep-research (degismedi)

3) Global policy (CEZERI WEB INTELLIGENCE POLICY)
  [ATLA] ~/.claude/CLAUDE.md (blok guncel)

4) Playwright MCP
  [ATLA] "playwright" zaten kayitli — dokunulmadi (duplicate olusturulmadi)

OZET
  Skill'ler   : ...=unchanged (8/8)
  Policy      : unchanged
  MCP         : already-present
  Degisiklik  : 0
```
Çıkış kodu: `0`

**`Degisiklik: 0`** — idempotency kanıtlandı.

## 3. çalıştırma — yalnızca bir kaynak dosya değiştirildikten sonra

`cezeri-deep-research/SKILL.md` düzeltildi, diğer 7 dosyaya dokunulmadı:

```
OZET
  Skill'ler   : cezeri-orchestrator=unchanged, cezeri-web-research=unchanged,
                cezeri-browser-agent=unchanged, cezeri-article-reader=unchanged,
                cezeri-documentation-reader=unchanged, cezeri-web-extractor=unchanged,
                cezeri-source-verifier=unchanged, cezeri-deep-research=updated
  Policy      : unchanged
  MCP         : already-present
  Degisiklik  : 1
```

Yalnızca gerçekten değişen dosya güncellendi — SHA-256 karşılaştırması seçici çalışıyor,
"hepsini yeniden yaz" davranışı yok.

## Mekanizma
`install.mjs` her dosya için kaynak içeriğin SHA-256'sını diskteki içeriğinkiyle
karşılaştırır (`lib/common.mjs::sha256`). Eşitse yazma yapılmaz. Farklıysa önce
`~/.claude/backups/cezeri-<zaman>/` altına yedek alınır, sonra atomik olarak yazılır
(`atomicWrite`: geçici dosya + `rename`), ardından yazılan içerik yeniden okunup hash'i
doğrulanır.

MCP için `claude mcp list` çıktısı kontrol edilir; kayıt varsa `mcp add` **hiç
çağrılmaz** — duplicate oluşmaz.

Policy için marker'lı blok karşılaştırılır; blok birebir aynıysa dosya yazılmaz.

## Sonuç
**PASS** — 2. çalıştırma `Degisiklik: 0`; 3. çalıştırma yalnızca değişen tek dosyayı
güncelledi. Kurulum tekrar tekrar çalıştırılabilir, sistemi bozmaz.
