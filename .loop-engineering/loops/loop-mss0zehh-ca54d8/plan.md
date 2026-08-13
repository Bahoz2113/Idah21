# Plan — CEZERI Web Intelligence

## Hedef
Claude Code'a global, kalıcı, yeniden kullanılabilir bir web araştırma + gerçek tarayıcı
yeteneği kazandıran taşınabilir kurulum paketi üretmek.

## Ortam kısıtları (ölçüldü)
| Kısıt | Ölçüm | Sonuç |
|---|---|---|
| Genel internet kapalı | `example.com`, `google.com` → proxy `403 policy denial`; `$HTTPS_PROXY/__agentproxy/status` → `connect_rejected` | Canlı web smoke testleri (TEST 1–6) bu container'da çalıştırılamaz |
| Container geçici | `~/.claude/` oturum sonunda silinir | Kalıcı çıktı repoda tutulur; global kurulum kullanıcı makinesinde yapılır |

## Doğrulanan güncel yöntemler
- Claude Code `2.1.231`
- Skill formatı: `~/.claude/skills/<ad>/SKILL.md` + YAML frontmatter (`name`, `description`,
  `when_to_use`, `allowed-tools`, `disable-model-invocation`, `user-invocable`, `context`)
- MCP: `claude mcp add -s user <ad> -- npx -y <paket>`
- `@playwright/mcp` v0.0.79 (npm registry, 2026-08-06), bin `playwright-mcp`, node ≥18
- Playwright MCP bayrakları: `--browser --headless --isolated --extension --user-data-dir
  --storage-state --caps --allowed-origins --blocked-origins`

## Adımlar
1. **Contract güncelle** — generic kriterleri CEZERI'ye özgü 10 kriterle değiştir. ✅
2. **Skill katmanı** — 8 SKILL.md yaz (`cezeri-*`).
3. **Policy** — `policy/CEZERI-POLICY.md`, marker'lı global blok.
4. **Kurulum katmanı** — `install.mjs` (CHECK→CREATE/UPDATE→VERIFY, SHA-256 idempotency,
   yedekleme, manifest), `uninstall.mjs`, `healthcheck.mjs`, `install.ps1`.
5. **Dokümantasyon** — `README.md`, `VERSION`, `SMOKE-TESTS.md`, `fixtures/injection-test.html`.
6. **Doğrulama** — offline çalıştırılabilir testler; kanıtlar `evidence/acN-*.md`.
7. **verify → score → report**.
8. **Commit + push** → `claude/new-session-niczi1`.

## Risk / hafifletme
| Risk | Hafifletme |
|---|---|
| Kurulum kullanıcının mevcut global CLAUDE.md'sini bozar | Marker'lı blok + hiçbir mevcut satır silinmez + değişiklik öncesi `~/.claude/backups/` yedeği |
| Duplicate MCP kaydı | `claude mcp list/get` ile önce kontrol, varsa dokunma; manifest'e "biz mi ekledik" bayrağı |
| Tekrar çalıştırma sistemi bozar | Her dosya SHA-256 ile karşılaştırılır; aynıysa yazma yok |
| Kanıtsız "tamamlandı" beyanı | Ağ gerektiren testler evidence'da `blocked` olarak dürüstçe işaretlenir, `pass` sayılmaz |

## Durdurma kriteri
Kabul kriterleri kanıtlandığında dur. Ağ bağımlı testler bu ortamda kanıtlanamaz —
kapsam dışı ilan edildi, kullanıcı makinesinde `SMOKE-TESTS.md` ile çalıştırılacak.
