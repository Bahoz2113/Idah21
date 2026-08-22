---
name: file-operations
description: Dosya okuma, yazma, düzenleme, arama ve güvenli toplu değişiklik becerisi. Repo içinde bir şey bulmak, çok dosyalı düzenleme yapmak, kod/konfig/doküman oluşturmak veya taşımak-silmek gerektiğinde kullanılır. Yıkıcı işlemlerde önce oku-yedekle-doğrula disiplinini zorlar.
---

# File Operations Skill

Amaç: dosya sisteminde **geri alınabilir, doğrulanmış** değişiklik yapmak.

## Araç seçimi
| İş | Tercih |
|---|---|
| Belirli dosyayı okuma | `cat` / `sed -n 'A,Bp'` (auto mode) veya `Read` |
| İçerik arama | `Grep` (ripgrep) — `grep -r` yerine |
| Dosya adı/patern bulma | `Glob` — `find` yerine |
| Tek noktalı düzenleme | `Edit` (exact match) |
| Yeni dosya / tam yeniden yazım | `Write` (önce `Read` şart) |
| Çok dosyalı mekanik değişim | `sed -i` + sonrasında `git diff` doğrulaması |
| Geniş, çok dizinli arama | `Explore` alt ajanı |

## Kurallar
1. **Önce oku, sonra yaz.** Var olan dosyayı okumadan üzerine yazma yok.
2. **Silmeden/üstüne yazmadan önce hedefe bak.** İçeriği görmeden `rm`/`>` yok.
3. **Yıkıcı işlem = onay.** Toplu silme, dizin taşıma, `git clean`, history yeniden yazımı → kullanıcı onayı. `permissions.yaml → never_auto_execute` mutlaktır.
4. **Atomik yaz.** Kritik state dosyalarında `tmp + rename`; yarım dosya bırakma.
5. **Diff ile doğrula.** Her toplu değişimden sonra `git diff --stat` + kritik hunk'ları gözden geçir.
6. **Çevre dosyalarına saygı.** `.gitignore`, `node_modules`, `dist`, `.git` içine dokunma.
7. **Geçici dosyalar scratchpad'e.** Proje dizini kirletilmez.
8. **Kod stiline uy.** Yeni dosya, komşu dosyaların isimlendirme/yorum yoğunluğu/idiomunu taklit eder.

## Secret güvenliği (mutlak)
- `.env`, `*.pem`, `id_rsa`, `credentials*`, `*.key` **okunmaz, loglanmaz, çıktıya yazılmaz, commit edilmez.**
- Yeni dosyaya asla gerçek token/parola gömülmez; `.env.example` placeholder kullanılır.
- Commit öncesi: `git diff --cached | grep -Ei 'api[_-]?key|secret|password|token|BEGIN .*PRIVATE KEY'` kontrolü.

## Loop entegrasyonu
- Değişiklik öncesi risk yüksekse: `loop checkpoint <id>`.
- Dosya kanıtı: `sha256sum <dosya>` çıktısı evidence dosyasına yazılır.
- Geri alma: `loop rollback <id> <checkpoint>` veya `git restore`.
