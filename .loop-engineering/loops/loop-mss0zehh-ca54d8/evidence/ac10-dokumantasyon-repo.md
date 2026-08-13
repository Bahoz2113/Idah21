status: pass

# AC10 — README, VERSION, SMOKE-TESTS mevcut ve repo mevcut yapısı korunmuş

## 1. Paket dosyaları (18 dosya)

```
cezeri-web-intelligence/README.md
cezeri-web-intelligence/SMOKE-TESTS.md
cezeri-web-intelligence/VERSION
cezeri-web-intelligence/fixtures/injection-test.html
cezeri-web-intelligence/healthcheck.mjs
cezeri-web-intelligence/install.mjs
cezeri-web-intelligence/install.ps1
cezeri-web-intelligence/lib/common.mjs
cezeri-web-intelligence/policy/CEZERI-POLICY.md
cezeri-web-intelligence/skills/cezeri-article-reader/SKILL.md
cezeri-web-intelligence/skills/cezeri-browser-agent/SKILL.md
cezeri-web-intelligence/skills/cezeri-deep-research/SKILL.md
cezeri-web-intelligence/skills/cezeri-documentation-reader/SKILL.md
cezeri-web-intelligence/skills/cezeri-orchestrator/SKILL.md
cezeri-web-intelligence/skills/cezeri-source-verifier/SKILL.md
cezeri-web-intelligence/skills/cezeri-web-extractor/SKILL.md
cezeri-web-intelligence/skills/cezeri-web-research/SKILL.md
cezeri-web-intelligence/uninstall.mjs
```

`VERSION` içeriği: `1.0.0`

## 2. README zorunlu bölümleri (master prompt şartı)

Belge README'de şunları istiyor — hepsi mevcut:

| İstenen bölüm | README başlığı |
|---|---|
| sistemin amacı | giriş + "Amaç:" alıntısı |
| mimari | **Mimari** (ağaç + yönlendirme matrisi + maliyet sırası) |
| Skill listesi | **Skill listesi** (8 satırlık tablo) |
| browser/MCP dependency | **Bağımlılıklar** (Node, Claude Code, @playwright/mcp, Chromium) |
| health check | **Sağlık kontrolü** |
| troubleshooting | **Sorun giderme** (9 satırlık belirti→çözüm tablosu) |
| update procedure | **Güncelleme** |
| uninstall/disable procedure | **Kaldırma / devre dışı bırakma** (tam kaldırma + geçici devre dışı) |

Ek bölümler: Hızlı başlangıç, Kurulum ne yapar, Güvenlik, Dosya konumları, Notlar, Sürüm.

## 3. SMOKE-TESTS.md — 7 test tanımlı

Master prompt'un istediği 7 test birebir karşılanıyor:

| Test | İçerik | Bu ortamda |
|---|---|---|
| TEST 1 | Browser — public sayfa aç, başlık + ana içerik oku | Ağ kapalı (kullanıcı makinesinde) |
| TEST 2 | Navigation — public linke tıkla, hedef sayfayı oku | Ağ kapalı |
| TEST 3 | Documentation — resmî doküman sayfasından bilgi çıkar | Ağ kapalı |
| TEST 4 | Article — haber sayfasından başlık/tarih/ana metin ayır | Ağ kapalı |
| TEST 5 | Source Verification — iddiayı iki kaynaktan karşılaştır | Ağ kapalı |
| TEST 6 | Automatic Routing — "internete gir" demeden otomatik devreye girme | Ağ kapalı |
| TEST 7 | Prompt Injection Resistance | ✅ **çalıştırıldı** (bkz. `ac7`) |

TEST 7 için yerel fixture (`fixtures/injection-test.html`, 6 enjeksiyon vektörü) pakete
dahil — ağ gerektirmez.

## 4. Repo bütünlüğü — mevcut yapı korundu

```
$ git status --porcelain
 M .loop-engineering/runtime/current-loop.json
?? .loop-engineering/loops/loop-mss0zehh-ca54d8/
?? cezeri-web-intelligence/
```

Yalnızca üç değişiklik: loop CLI'ın kendi yazdığı runtime dosyası, yeni loop klasörü ve
yeni paket klasörü.

Dokunulmaması gerekenlerin kontrolü:

```
  DEGISMEDI: CLAUDE.md
  DEGISMEDI: README.md
  DEGISMEDI: package.json
  DEGISMEDI: turbo.json
  DEGISMEDI: vercel.json
  DEGISMEDI: .claude/rules/loop-first.md
```

`.claude/`, `apps/`, `packages/`, `docs/`, `scripts/` altında değişiklik yok:

```
$ git status --porcelain -- .claude apps packages docs scripts
  (bos = degisiklik yok)
```

## 5. Master prompt şartı: "repository içine gereksiz CEZERI dosyası bırakma"

Belge, CEZERI'nin **global user scope**'a kurulmasını ve proje repository'sine gereksiz
dosya bırakılmamasını istiyor. Bu karşılandı:

- Repo `CLAUDE.md`'sine CEZERI bölümü **eklenmedi** — policy yalnızca kurulum anında
  `~/.claude/CLAUDE.md`'ye yazılır.
- Skill'ler repo `.claude/skills/`'e değil, kurulumda `~/.claude/skills/`'e gider.
- Repoda duran şey yalnızca **taşınabilir kurulum paketi**dir (kaynak), çalışan sistem
  değil.

Bu ortam kısıtı gereği zorunludur: container geçicidir, `~/.claude/` oturum sonunda
silinir; paket kalıcı olarak repoda tutulmazsa hiçbir yerde kalmaz. Kullanıcı bu yaklaşımı
onayladı.

## Sonuç
**PASS** — README (8 zorunlu bölüm), VERSION (1.0.0) ve SMOKE-TESTS (7 test) mevcut;
repo mevcut yapısı değişmedi.
