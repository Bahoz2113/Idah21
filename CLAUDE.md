# CLAUDE.md — Loop Engineering OS

Bu repository **Loop-first** çalışır. İlke: *«Stop prompting. Design the loop.»*

## Temel Kural
> Bir ajanın çıktı üretmesi yeterli değildir. Çıktının sözleşmeye uygun, kanıtlanmış,
> ölçülmüş, puanlanmış, denetlenmiş ve gerektiğinde geri alınabilir olması gerekir.

## Zorunlu Çalışma Kuralları
1. **Contract olmadan büyük iş başlatma.** Önce `loop init <template> "<hedef>"`.
2. **Plan olmadan implementation yok.** `loops/<id>/plan.md` doldurulmadan kod yazma.
3. **Verification zorunlu.** Her kabul kriteri için `loops/<id>/evidence/acN-*.md`
   dosyası üret; içinde `status: pass` + ham kanıt (test çıktısı, ölçüm, dosya hash).
4. **"Tamamlandı" demeden önce:** `loop verify` PASS + `loop score` ≥ target + rapor.
5. **Baseline zorunlu.** Optimizasyonda önce ölç, sonra değiştir, sonra karşılaştır.
6. **Checkpoint.** Riskli değişiklik öncesi `loop checkpoint <id>`.
7. **Human approval.** `config/permissions.yaml` never_auto_execute listesi mutlaktır:
   production deploy, veri silme, migration, secret, ödeme, müşteri mesajı, main'e merge.
8. **Aynı hata 2 kez tekrarlanırsa strateji değiştir.** 3. tekrar = FAILED + escalation.
9. **Memory kuralları:** Öğrenimler `memory/` altına; hassas veri asla; ham log asla.
10. **Secret güvenliği:** .env okunmaz, loglanmaz, çıktıya yazılmaz.

## Komutlar
```
node .loop-engineering/scripts/loop.mjs <komut>
init | run | status | list | pause | resume | verify | score |
checkpoint | rollback | report | archive
```
Kısayol: `.loop-engineering/scripts/loop` (bash) ve `loop.ps1` (PowerShell).

## Ajan Rolleri
`.loop-engineering/agents/` — orchestrator, intent-analyst, planner, researcher,
implementer, verifier (bağımsız!), critic, scorer, security-reviewer, qa-engineer,
performance-analyst, documentation-agent, memory-curator, human-approval-gate.
Claude Code bu rolleri sırasıyla üstlenir; CLI durum/kanıt/skor altyapısını zorlar.

## Çekirdek Yetenekler (Skills)
`.claude/skills/` — repoya commit edilmiştir, her oturumda otomatik yüklenir.

| Skill | Ne zaman |
|---|---|
| `web-research` | Güncel/harici bilgi, doküman, kaynak doğrulama |
| `file-operations` | Dosya okuma/yazma/arama, toplu değişiklik, secret koruması |
| `terminal-ops` | Komut yürütme, build/test/git, teşhis, yıkıcı komut kontrolü |
| `code-interpreter` | Hesap, veri işleme, baseline ölçümü, çalıştırarak ispat |
| `context-manager` | Artifact yayını + bağlam/hafıza bütçesi |
| `agent-fleet` | Harici ajan/araç filosu seçimi ve güvenli kurulumu |

İşe uygun skill varsa **önce o okunur**. Kurallar: `.claude/rules/core-skills.md`.
Tüm projelerde geçerli kılmak için: `bash scripts/install-core-skills.sh`

## Source of Truth
- Sistem: `.loop-engineering/SYSTEM.md`
- Aktif loop: `.loop-engineering/runtime/current-loop.json`
- Öğrenimler: `.loop-engineering/memory/`
- İzinler: `.loop-engineering/config/permissions.yaml`
- Yetenekler: `.claude/skills/README.md`
