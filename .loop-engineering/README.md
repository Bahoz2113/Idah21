# Loop Engineering OS

Kurulum: bu klasörü (+ CLAUDE.md + .claude/) reponun köküne kopyala. Node ≥ 18 yeterli, bağımlılık yok.

## Hızlı Başlangıç
```bash
node .loop-engineering/scripts/loop.mjs init generic-improvement "README'ye kurulum bölümü ekle"
# işi yap, kanıt üret:
echo "status: pass\nkanıt: README.md satır 10-25" > .loop-engineering/loops/<id>/evidence/ac1-readme.md
node .loop-engineering/scripts/loop.mjs run <id>
node .loop-engineering/scripts/loop.mjs report <id>
```

## Kanıt Formatı
`loops/<id>/evidence/acN-<slug>.md` → içinde `status: pass` veya `status: fail`
+ ham test çıktısı / ölçüm / dosya referansı. N = contract'taki kriter sırası.

Template'ler: software-development, bug-fix, research, optimization,
security-audit, content-production, qa-audit, generic-improvement, pr-status.

Detay: SYSTEM.md ve CLAUDE.md.
