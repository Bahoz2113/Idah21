status: pass

# AC5 — Playwright MCP user scope'a eklenir ve duplicate oluşturmaz

## Doğrulanan güncel yöntem
Kurulum yöntemi belgenin "eski veya deprecated syntax kullanma" şartı gereği önce doğrulandı:

| Konu | Doğrulanan | Kaynak |
|---|---|---|
| Komut biçimi | `claude mcp add [options] <name> -- <command> [args...]`, `-s/--scope local\|user\|project` | `claude mcp add --help` (v2.1.231) |
| Paket | `@playwright/mcp` **v0.0.79** (yayın 2026-08-06), bin `playwright-mcp`, node ≥18 | npm registry API |
| Resmî config şekli | `{"command":"npx","args":["@playwright/mcp@latest"]}` | microsoft/playwright-mcp README |

## Yol A — `claude` CLI mevcutken

### 1. Temiz sistemde ekleme
```
4) Playwright MCP
  [OK] "playwright" user scope'a eklendi

6) Dogrulama
  [OK] MCP kaydi okunabiliyor: playwright
```

### 2. Bağlantı durumu — gerçekten çalışıyor
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
**global** kurulum hedefi karşılandı.

### 3. Duplicate oluşturmama
```
4) Playwright MCP
  [ATLA] "playwright" zaten kayitli — dokunulmadi (duplicate olusturulmadi)
```

## Yol B — `claude` CLI olmadan (gerçek kullanıcı senaryosunda ortaya çıktı)

Kullanıcının Windows makinesinde `claude` komut satırı aracı kurulu değildi ve ilk sürüm
MCP adımını atlıyordu:

```
[UYARI] claude CLI bulunamadi — skill ve policy kurulacak, MCP adimi atlanacak.
  MCP : unavailable
```

Master prompt "mümkün olan her şeyi kendin kur, yalnızca gerçekten kullanıcı etkileşimi
zorunlu olduğunda dur" diyor — CLI kurmak zorunlu değil, çünkü `claude mcp add -s user`
zaten `~/.claude.json` dosyasına yazıyor. Bu yüzden `addMcpToConfig()` /
`removeMcpFromConfig()` eklendi: CLI yoksa kayıt doğrudan yapılandırma dosyasına yazılır.

### Test — `claude` PATH'ten gizlenerek

```
[UYARI] claude komut satiri araci bulunamadi — MCP kaydi dogrudan ~/.claude.json'a yazilacak.

4) Playwright MCP
  [OK] "playwright" ~/.claude.json icine eklendi (claude CLI olmadan)

6) Dogrulama
  [OK] MCP kaydi ~/.claude.json icinde dogrulandi: playwright

  MCP : added-via-config
```

Yazılan kayıt — `claude mcp add` çıktısıyla birebir aynı:

```json
{
  "playwright": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"],
    "env": {}
  }
}
```

### Dosyanın geri kalanına dokunulmadı

```
Diger anahtarlar korundu mu? ust seviye anahtar sayisi: 17
oauthAccount duruyor mu: True
projects duruyor mu: True
```

`~/.claude.json` kritik bir dosyadır (oauth hesabı, proje kayıtları). Yalnızca
`mcpServers.playwright` eklenir; yazmadan önce dosya `~/.claude/backups/` altına
yedeklenir, yazma atomiktir ve sonrasında geri okunup doğrulanır.

### İdempotency (CLI'sız)
```
  [ATLA] "playwright" zaten kayitli — dokunulmadi (duplicate olusturulmadi)
  MCP         : already-present
  Degisiklik  : 0
```

### Kaldırma (CLI'sız)
```
3) Playwright MCP
  [OK] "playwright" kaydi ~/.claude.json icinden kaldirildi
```
```
mcp kaydi     : {} (beklenen {})
ust anahtarlar: 17 (kurulum oncesi 17 idi)
oauthAccount  : True
projects      : True
```

## İki yolun uyumu
CLI'sız yolla yazılan kayıt, `claude` CLI mevcut olduğunda CLI tarafından da tanınıyor:
aynı kayıt için `claude mcp list` → `playwright: npx -y @playwright/mcp@latest - √ Connected`.
İki yol aynı hedefe yazar, çakışmaz.

## Bilinen davranış (kullanıcıya bildirilir)
MCP kaydı yapıldıktan sonra `mcp__playwright__*` araçları **çalışan oturuma yüklenmez** —
Claude Code MCP sunucularını oturum başlangıcında bağlar. Bu beklenen davranıştır ve
`install.mjs` kapanış mesajı, `README.md` sorun giderme tablosu, `SMOKE-TESTS.md` 2. adım
ve `cezeri-browser-agent/SKILL.md` ön koşul bölümünde belirtilmiştir.

## Sonuç
**PASS** — MCP user scope'a eklendi (`√ Connected`), duplicate oluşturmuyor, kaldırma
temiz. `claude` CLI olmayan makinelerde de kullanıcıdan hiçbir ek adım istemeden kuruluyor.
