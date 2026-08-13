status: pass

# AC9 — uninstall.mjs kurulumu tam geri alıyor (dosya + policy + MCP)

## 1. Kaldırma öncesi durum

```
skill klasoru sayisi: 8
policy blogu: 1
mcp kayitli: True
durum klasoru: VAR
```

## 2. Dry-run — önce ne yapılacağı gösteriliyor

```
1) Skill'ler
  [BILGI] cezeri-orchestrator silinecek
  ... (8 adet)
2) Global policy blogu
  [BILGI] CEZERI blogu silinecek, blok disi icerik korunacak
3) Playwright MCP
  [BILGI] kaldirilacak: claude mcp remove -s user playwright
4) Durum klasoru
  [BILGI] /root/.claude/cezeri-web-intelligence silinecek
```

## 3. Gerçek kaldırma

```
1) Skill'ler
  [OK] cezeri-orchestrator silindi
  [OK] cezeri-web-research silindi
  [OK] cezeri-browser-agent silindi
  [OK] cezeri-article-reader silindi
  [OK] cezeri-documentation-reader silindi
  [OK] cezeri-web-extractor silindi
  [OK] cezeri-source-verifier silindi
  [OK] cezeri-deep-research silindi

2) Global policy blogu
  [OK] CEZERI blogu silindi, diger icerik korundu

3) Playwright MCP
  [OK] "playwright" kaydi kaldirildi

4) Durum klasoru
  [OK] /root/.claude/cezeri-web-intelligence silindi

  Geri alinan adim sayisi: 11
```

Çıkış kodu: `0`

## 4. Kaldırma sonrası doğrulama

```
skill klasoru sayisi : 0        (beklenen 0)   ✅
policy blogu         : 0        (beklenen 0)   ✅
marker kalintisi     : 0        (beklenen 0)   ✅
mcp kayitli          : False    (beklenen False) ✅
durum klasoru        : YOK      (beklenen YOK) ✅
```

Marker kalıntısı 0 — yani `<!-- CEZERI-WEB-INTELLIGENCE:BEGIN/END -->` yorumları da
temizlendi, artık dosyada hiçbir CEZERI izi yok.

## 5. Kullanıcı içeriği bit düzeyinde korundu

```
--- sha256 (kaldirma sonrasi) ---
44e6ce5faa43a8e06e53d35b5800f2915cc819117d6c0c57872da0d6d48bd7bb
--- sha256 (kurulum oncesi)  ---
44e6ce5faa43a8e06e53d35b5800f2915cc819117d6c0c57872da0d6d48bd7bb
```

**Aynı hash** — kurulum + kaldırma döngüsü kullanıcının global CLAUDE.md'sini
bozmadan orijinal hâline döndürdü.

## 6. Yedekler duruyor

```
/root/.claude/backups/cezeri-2026-08-13T21-38-34-465Z
/root/.claude/backups/cezeri-2026-08-13T21-40-57-851Z
/root/.claude/backups/cezeri-2026-08-13T21-44-05-460Z
```

Yedekler kasıtlı olarak silinmez — kaldırma sonrası geri dönüş imkânı korunur.

## Güvenlik davranışı: "sadece kendi kurduğunu kaldır"

`uninstall.mjs` manifest'teki `mcp.added_by_cezeri` bayrağını okur. MCP kaydını CEZERI
eklemediyse **dokunmaz**:

```js
} else if (!addedByUs) {
  skip("MCP kaydini CEZERI eklemedi — dokunulmadi");
}
```

Aynı şekilde policy için yalnızca marker'lar arası silinir; kullanıcının kendi notları
hiçbir koşulda silinmez. `--keep-mcp` bayrağıyla MCP kaydı bilinçli olarak bırakılabilir.

## Sonuç
**PASS** — 4 bileşenin tamamı (8 skill + policy bloğu + MCP kaydı + durum klasörü) geri
alındı, kullanıcı içeriği bit düzeyinde korundu, yedekler saklandı.
