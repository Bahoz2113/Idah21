# Rule: Core Skills

Çekirdek yetenekler `.claude/skills/` altında kalıcıdır ve **her projede** geçerlidir.

## Seçim kuralı
| Durum | Skill |
|---|---|
| Güncel/harici bilgi, doküman, doğrulama gerekiyor | `web-research` |
| Dosya okuma/yazma/arama/toplu değişiklik | `file-operations` |
| Komut yürütme, build/test/git, teşhis | `terminal-ops` |
| Hesap, veri işleme, ölçüm, çalıştırarak ispat | `code-interpreter` |
| Rapor/artefakt üretimi, bağlam ve hafıza yönetimi | `context-manager` |
| Harici ajan/araç kurulumu veya seçimi | `agent-fleet` |

## Zorunluluklar
1. İşe uygun skill varsa **önce o okunur**, sonra iş yapılır.
2. Skill kuralları CLAUDE.md ve `permissions.yaml` ile çelişemez; çelişki halinde
   CLAUDE.md > permissions.yaml > skill sırası geçerlidir.
3. Harici araç kurulumu (`agent-fleet`) daima kullanıcı onayına tabidir.
4. `curl … | bash` biçiminde doğrudan yürütme yasaktır.
