---
name: terminal-ops
description: Terminal/bash komut yürütme becerisi. Build, test, lint, paket kurulumu, git işlemleri, süreç ve log inceleme, sistem teşhisi gerektiğinde kullanılır. Uzun süren işleri arka plana alır, yıkıcı komutları onaya bağlar, çıktıyı kanıta çevirir.
---

# Terminal / Bash Skill

Amaç: komutu **çalıştırmak** değil, **sonucu kanıtlamak**.

## Temel disiplin
1. **Komuttan önce niyet.** Ne beklediğini bil; çıktı beklentiyle uyuşmazsa dur ve teşhis et.
2. **Mutlak yol kullan.** Bileşik komutta `cd` izin promptu tetikler; `cd` yerine yolu tam ver.
3. **Shell state kalıcı değil.** `export`/fonksiyon bir sonraki çağrıda yok; gerekiyorsa tek komutta zincirle.
4. **Uzun iş → arka plan.** `run_in_background: true`; `&` ve `sleep` ile bekleme yok.
5. **Timeout bilinçli.** Varsayılan 120s, maks 600s. Aşacaksa arka plan.
6. **Çıktıyı sınırla.** `| head -50`, `--quiet`, `-q`; bağlamı log çöplüğüyle doldurma.
7. **Interaktif bayrak yok.** `git rebase -i`, `git add -i`, `npm init` (promptlu) çalışmaz — non-interactive muadili kullan.

## Yıkıcı komut listesi → önce onay
`rm -rf`, `git reset --hard`, `git push --force`, `git clean -fd`, `DROP`/`TRUNCATE`,
`docker system prune`, `kill -9` (bilinmeyen pid), production deploy, migration çalıştırma.
→ `.loop-engineering/config/permissions.yaml` `never_auto_execute` listesi mutlaktır.

## Standart teşhis akışı
```bash
# 1) durum
git status --short && git log --oneline -5
# 2) hızlı kontroller (repo neyi kullanıyorsa)
npm run lint --silent; npm run typecheck --silent; npm test --silent
# 3) başarısızsa daralt
npm test -- <tek-dosya> 2>&1 | tail -40
```
Kural: **başarısız testi önce yeniden üret**, sonra düzelt, sonra aynı komutun geçtiğini göster.

## Git
- Push: `git push -u origin <branch>`; sadece **ağ hatasında** 4 kez üstel geri çekilme (2s/4s/8s/16s).
- Commit/push yalnızca istendiğinde. Default branch'e doğrudan push yok.
- Başkasının branch'inde history yeniden yazımı yok (rebase/amend/force-push).

## Disk
"no space left on device" → tahsis dolmuştur, makine bozuk değildir. Build artefaktı, cache, eski clone sil; silme yazma başarısızken bile çalışır.

## Kanıt formatı
```markdown
status: pass
command: <çalıştırılan komut>
exit_code: 0
output: |
  <ham çıktının ilgili kısmı>
timestamp: <ISO8601>
```
Kanıt = **ham çıktı**. Özet kanıt değildir.

## Secret
`.env` kaynak gösterilmez, `env` çıktısı loglanmaz, secret komut satırına yazılmaz (shell history).
