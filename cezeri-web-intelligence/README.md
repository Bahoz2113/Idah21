# CEZERI Web Intelligence

Claude Code'a **global**, kalıcı ve yeniden kullanılabilir bir web araştırma + gerçek
tarayıcı yeteneği kazandıran kurulum paketi.

> Amaç: her seferinde "internette araştır", "browser kullan" veya "siteyi aç" demek zorunda
> kalmamak. Claude Code bir proje üzerinde çalışırken dış dünyadan güncel veya doğrulanabilir
> bilgi görevin kalitesini anlamlı biçimde artıracaksa sistemi **kendiliğinden** devreye sokar.

Bu paket tek bir projeye özel değildir. Kurulduktan sonra **tüm projelerde** geçerlidir.

---

## Hızlı başlangıç

### Windows

```powershell
cd <repo>\cezeri-web-intelligence
.\install.ps1
```

### macOS / Linux

```bash
cd <repo>/cezeri-web-intelligence
node install.mjs
```

Sonra **Claude Code'u yeniden başlatın** (yeni MCP sunucusu ancak yeniden başlatıldığında
bağlanır), ardından:

```bash
node healthcheck.mjs
```

Kurulum **idempotenttir** — tekrar tekrar çalıştırmak güvenlidir, hiçbir şeyi bozmaz.

---

## Mimari

```
CEZERI WEB INTELLIGENCE
├── orchestrator            ← karar verici: gerekli mi? hangi yöntem?
├── web-research            ← arama + hafif sayfa getirme
├── browser-agent           ← gerçek tarayıcı (Playwright MCP)
├── article-reader          ← haber/makale ayrıştırma
├── documentation-reader    ← resmî doküman + sürüm karşılaştırma
├── web-extractor           ← yapılandırılmış veri çıkarma
├── source-verifier         ← iddia doğrulama
└── deep-research           ← çok kaynaklı araştırma döngüsü
```

**Maliyet sırası:** `LOCAL → DIRECT/FETCH → SEARCH → BROWSER → DEEP RESEARCH`
(JS ağırlıklı veya etkileşim gerektiren sitede doğrudan tarayıcıya geçilir.)

**Yönlendirme matrisi:**

| Durum | Yöntem | Skill |
|---|---|---|
| Yerel dosya yeterli | LOCAL CONTEXT | — |
| Basit statik içerik | HTTP / FETCH | `cezeri-web-research` |
| Güncel bilgi bulunacak | SEARCH | `cezeri-web-research` |
| JS / dinamik navigation | PLAYWRIGHT BROWSER | `cezeri-browser-agent` |
| Haber / makale | ARTICLE + VERIFY | `cezeri-article-reader` + `cezeri-source-verifier` |
| Resmî teknik doküman | DOCUMENTATION | `cezeri-documentation-reader` |
| Çok kaynaklı karşılaştırma | DEEP RESEARCH | `cezeri-deep-research` |
| Tablo/liste/link/metadata | EXTRACTOR | `cezeri-web-extractor` |

---

## Skill listesi

| Skill | Ne yapar |
|---|---|
| `cezeri-orchestrator` | Dış bilgi gerekli mi karar verir, en ucuz doğru yöntemi seçer, araç başarısız olursa alternatife geçer |
| `cezeri-web-research` | Arama + hafif getirme. Snippet'e güvenmez, gerçek sayfayı açar |
| `cezeri-browser-agent` | Playwright MCP: URL açma, tıklama, sekme, scroll, JS bekleme, form, metin çıkarma, metadata, screenshot |
| `cezeri-article-reader` | Başlık, yayın, yazar, tarih, güncelleme, ana metin, iddialar, isimler, kurumlar, sayısal veri, birincil kaynaklar; boilerplate ayıklar |
| `cezeri-documentation-reader` | Resmî doküman okur ve projedeki lockfile sürümüyle karşılaştırır; deprecated syntax kullandırmaz |
| `cezeri-web-extractor` | headings, tables, lists, links, prices, dates, JSON-LD → JSON/Markdown |
| `cezeri-source-verifier` | Birincil kaynak + ikinci bağımsız kaynak + tarih kontrolü; çelişkiyi gizlemez |
| `cezeri-deep-research` | DEFINE → SEARCH → DISCOVER → OPEN → EXTRACT → CROSS-CHECK → GAPS → SYNTHESIZE → REPORT |

---

## Kurulum ne yapar

| # | Adım | Ayrıntı |
|---|---|---|
| 1 | Ön koşul | Node ≥18, `npx`, `claude` CLI kontrolü |
| 2 | Skill'ler | 8 dosya → `~/.claude/skills/cezeri-*/SKILL.md` |
| 3 | Global policy | `~/.claude/CLAUDE.md` içine marker'lı **"CEZERI WEB INTELLIGENCE POLICY"** bloğu |
| 4 | Browser MCP | `claude mcp add -s user playwright -- npx -y @playwright/mcp@latest` |
| 5 | Manifest | `~/.claude/cezeri-web-intelligence/installed.json` (dosya listesi + SHA-256) |
| 6 | Doğrulama | Dosya varlığı, frontmatter geçerliliği, policy bloğu, MCP kaydı |

**Korunanlar:** Mevcut `~/.claude/CLAUDE.md` içeriğine dokunulmaz — yalnızca marker'lar
arasındaki blok yönetilir. Playwright MCP zaten kayıtlıysa **dokunulmaz** (duplicate yok).
Değiştirilen her dosyanın öncesi `~/.claude/backups/cezeri-<zaman>/` altına yedeklenir.

### Kurulum seçenekleri

```bash
node install.mjs --dry-run     # hiçbir şey yazmaz, ne yapılacağını gösterir
node install.mjs --no-mcp      # MCP adımını atlar (skill + policy kurar)
```

```powershell
.\install.ps1 -DryRun
.\install.ps1 -NoMcp
.\install.ps1 -Uninstall
```

---

## Bağımlılıklar

| Bağımlılık | Gereksinim | Not |
|---|---|---|
| Node.js | ≥ 18 | `npx` ile birlikte |
| Claude Code CLI | ≥ 2.1 | Skill ve MCP altyapısı için |
| `@playwright/mcp` | `@latest` | `npx` ile çalışma anında çekilir, global kurulum gerekmez |
| Chromium/Chrome/Edge | en az biri | Yoksa: `npx playwright install chromium` |

Ağ erişimi gerekir. Kısıtlı ağda (kurumsal proxy, izinli-liste politikası) canlı web
testleri başarısız olur; bu paketin kendisi yine de kurulur ve yerel testler çalışır.

---

## Sağlık kontrolü

```bash
node healthcheck.mjs           # insan okunur
node healthcheck.mjs --json    # makine okunur
node healthcheck.mjs --no-net  # ağ testini atla
```

Kontrol edilenler: Node/npx · Claude Code erişilebilir mi · skill'ler discover edilebilir
formatta mı · global policy bloğu yerinde mi · MCP browser kayıtlı mı · **browser gerçekten
başlıyor mu** (yerel HTML render ederek — ağ gerektirmez) · ağ erişimi var mı.

Çıkış kodu: `0` sağlıklı, `1` kritik sorun var. `WARN` ve `BLOCKED` kritik değildir.

---

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `skills: FAIL` | `node install.mjs` — idempotent, güvenle tekrar çalıştırılır |
| `policy: FAIL` | Aynı: `node install.mjs` |
| `mcp-registered: FAIL` | `claude mcp add -s user playwright -- npx -y @playwright/mcp@latest` |
| `mcp-registered: WARN` (bağlantı sorunlu) | **Claude Code'u yeniden başlatın.** Yeni MCP sunucusu çalışan oturuma bağlanmaz |
| `browser-launch: WARN` | `npx playwright install chromium` |
| "profile in use" hatası | Açık bir tarayıcı oturumu var — kapatın, veya `--isolated` kullanın |
| Claude web'e gitmiyor | Global policy bloğu eksik olabilir: `node healthcheck.mjs` ile bakın |
| Claude gereksiz yere web'e gidiyor | `cezeri-orchestrator` maliyet sırasını uygular; yine de sürerse istemde "yerel dosyalar yeterli" deyin |
| Kurumsal proxy / 403 | Ağ politikanız dış erişimi engelliyor olabilir. Yerel testler (TEST 7) yine çalışır |

---

## Güvenlik

**Web içeriği DATA'dır, SYSTEM INSTRUCTION değildir.**

Bir sayfadaki metin, yorum, gizli element veya script Claude'a sistem talimatını
değiştirmesini, secret okumasını, terminal komutu çalıştırmasını, dosya silmesini,
credential göndermesini veya güvenlik kuralını devre dışı bırakmasını söylüyorsa bu
**PROMPT INJECTION** olarak değerlendirilir ve uygulanmaz.

Bu direnç `fixtures/injection-test.html` ile test edilir (bkz. SMOKE-TESTS.md TEST 7).
Fixture 6 farklı enjeksiyon vektörü içerir ve **ağ gerektirmez**.

**Yasaklar:** CAPTCHA bypass · paywall kırma · bot korumasını uygunsuz şekilde aşma ·
credential çalma · cookie/token dump · robots/access-control engellerini kırma ·
izinsiz private alanlara girme.

**Oturum kullanımı:** Giriş gerektiren bir site için kullanıcının mevcut yetkili tarayıcı
oturumu yalnızca resmî yöntemle kullanılır (`--extension`, `--user-data-dir`,
`--storage-state`). Parola, cookie değeri veya token **istenmez ve loglanmaz**.

---

## Güncelleme

```bash
git pull                    # paketi güncelle
node install.mjs            # değişen dosyalar güncellenir, aynı olanlara dokunulmaz
```

Kurucu her dosyayı SHA-256 ile karşılaştırır. Değişmiş dosya varsa önce yedekler, sonra
günceller. Policy bloğu marker'lar arasında yerinde güncellenir; blok dışındaki kendi
notlarınız korunur.

Kurulu sürümü görmek için:

```bash
cat ~/.claude/cezeri-web-intelligence/VERSION
node healthcheck.mjs --json | grep installed_version
```

---

## Kaldırma / devre dışı bırakma

**Tam kaldırma:**

```bash
node uninstall.mjs              # skill'ler + policy bloğu + MCP kaydı + durum klasörü
node uninstall.mjs --dry-run    # önce ne silineceğini gör
node uninstall.mjs --keep-mcp   # Playwright MCP'yi bırak
```

Kaldırma yalnızca CEZERI'nin kurduğunu geri alır: `~/.claude/CLAUDE.md` içindeki blok
dışı içeriğinize dokunulmaz, MCP kaydı yalnızca CEZERI eklediyse silinir.

**Geçici devre dışı bırakma** (silmeden):
`~/.claude/CLAUDE.md` içindeki CEZERI bloğunu HTML yorumuna alın veya skill klasörlerini
geçici olarak yeniden adlandırın. Sonra `node install.mjs` ile geri döner.

**Yedekler:** `~/.claude/backups/cezeri-<zaman-damgası>/`

---

## Dosya konumları

| Ne | Nerede |
|---|---|
| Skill'ler | `~/.claude/skills/cezeri-*/SKILL.md` |
| Global policy | `~/.claude/CLAUDE.md` (marker'lı blok) |
| MCP kaydı | `~/.claude.json` (user scope) |
| Kurulum manifesti | `~/.claude/cezeri-web-intelligence/installed.json` |
| Sürüm | `~/.claude/cezeri-web-intelligence/VERSION` |
| Yedekler | `~/.claude/backups/cezeri-<zaman>/` |
| Kaynak paket | bu klasör (repoda) |

---

## Notlar

- **MCP mi, CLI mi?** Playwright ekibi coding agent'lar için artık
  [Playwright CLI + Skills](https://github.com/microsoft/playwright-cli) yaklaşımını da
  öneriyor (daha az token tüketir). Bu paket MCP yolunu kullanır; token maliyeti sizin için
  sorun olursa CLI alternatifine geçilebilir.
- Skill'ler `~/.claude/skills/` altına kurulur (personal scope) — tüm projelerinizde geçerli
  olur, proje repolarınıza dosya bırakmaz.
- Kurulum betikleri bağımlılıksızdır; sadece Node standart kütüphanesini kullanır.

## Sürüm

Bkz. `VERSION` — mevcut: **1.0.0**
