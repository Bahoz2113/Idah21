status: pass

# AC5 — Playwright MCP user scope'a eklenir ve duplicate oluşturmaz

## Doğrulanan güncel yöntem
Kurulum yöntemi belgenin "eski veya deprecated syntax kullanma" şartı gereği önce doğrulandı:

| Konu | Doğrulanan | Kaynak |
|---|---|---|
| Komut biçimi | `claude mcp add [options] <name> -- <command> [args...]`, `-s/--scope local\|user\|project` | `claude mcp add --help` (v2.1.231) |
| Paket | `@playwright/mcp` **v0.0.79** (yayın 2026-08-06), bin `playwright-mcp`, node ≥18 | npm registry API |
| Resmî config şekli | `{"command":"npx","args":["@playwright/mcp@latest"]}` | microsoft/playwright-mcp README |

## 1. Temiz sistemde ekleme

```
4) Playwright MCP
  [OK] "playwright" user scope'a eklendi
```

Doğrulama adımı:
```
6) Dogrulama
  [OK] MCP kaydi okunabiliyor: playwright
```

## 2. Yazılan kayıt (`~/.claude.json`, user scope)

```json
{
  "playwright": {
    "type": "stdio",
    "command": "npx",
    "args": [
      "-y",
      "@playwright/mcp@latest"
    ],
    "env": {}
  }
}
```

## 3. Bağlantı durumu — gerçekten çalışıyor

```
$ claude mcp list
Checking MCP server health…

playwright: npx -y @playwright/mcp@latest - √ Connected
```

```
$ claude mcp get playwright
playwright:
  Scope: User config (available in all your projects)
  Status: √ Connected
  Type: stdio
  Command: npx
  Args: -y @playwright/mcp@latest
```

`Scope: User config (available in all your projects)` — master prompt'un istediği
**global** kurulum hedefi karşılandı. Sunucu **√ Connected**.

## 4. Duplicate oluşturmama

Kurulum ikinci kez çalıştırıldığında:

```
4) Playwright MCP
  [ATLA] "playwright" zaten kayitli — dokunulmadi (duplicate olusturulmadi)
```

Özet: `MCP : already-present`

`mcpStatus()` önce `claude mcp list` çıktısını kontrol eder; kayıt varsa `mcp add`
**hiç çağrılmaz**.

## 5. Bilinen davranış (kullanıcıya bildirilir)

Bu oturumda MCP `√ Connected` olmasına rağmen `mcp__playwright__*` araçları **çalışan
oturuma yüklenmedi** — Claude Code MCP sunucularını oturum başlangıcında bağlar.
Bu beklenen davranıştır ve şu üç yerde açıkça belirtilmiştir:

- `install.mjs` kurulum sonu mesajı: *"Siradaki tek adim: Claude Code'u yeniden baslatin"*
- `README.md` sorun giderme tablosu
- `SMOKE-TESTS.md` 2. adım
- `cezeri-browser-agent/SKILL.md` ön koşul bölümü

## Sonuç
**PASS** — MCP user scope'a eklendi, `√ Connected`, tekrar çalıştırmada duplicate
oluşturmuyor; yeniden başlatma gereği kullanıcıya net biçimde bildiriliyor.
