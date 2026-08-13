# successful patterns

- [2026-07-11T08:19:35.424Z] loop:loop-mrg3fyf9-ce02cd | generic-improvement: Test loop hedefi | score:100 | template:generic-improvement

- [2026-07-11T08:19:56.175Z] loop:loop-mrg3gefk-09b5d1 | generic-improvement: Test loop hedefi | score:100 | template:generic-improvement

- [2026-07-11T08:20:12.146Z] loop:loop-mrg3gqqt-a00082 | generic-improvement: Loop Engineering OS kullanım kılavuzuna hızlı başlangıç bölü | score:100 | template:generic-improvement

- [2026-08-13] loop:loop-mss0zehh-ca54d8 | CEZERI Web Intelligence global kurulum paketi | score:100 | template:software-development
  - **Kısıtlı ortamda dürüst kanıt:** Ağ kapalı olduğunda canlı testi "pass" saymak yerine
    ayrı bir `blocked-*.md` dosyasına yaz (acN- öneki verme → skora girmez). Kanıtlanabilen
    her şeyi offline yola çevir: prompt-injection testi `file://` fixture ile, tarayıcı
    testi yerel HTML render ile ağ olmadan kanıtlandı.
  - **SHA-256 tabanlı idempotency:** Kurucuda her dosyayı hash'le karşılaştır, aynıysa hiç
    yazma. 2. çalıştırmada `Degisiklik: 0` çıktısı idempotency'nin doğrudan kanıtı oldu.
  - **Marker'lı blok yönetimi:** Kullanıcının global CLAUDE.md'sine dokunurken
    `BEGIN/END` marker'ları arasını yönet, dışına asla dokunma. Kurulum+kaldırma sonrası
    dosyanın SHA-256'sı orijinaliyle birebir aynı çıktı — en güçlü koruma kanıtı bu.
  - **"Sadece kendi kurduğunu kaldır":** Manifest'e `added_by_cezeri` bayrağı yaz;
    uninstall bu bayrağa bakıp kullanıcının kendi eklediği MCP kaydına dokunmuyor.
  - **Kurulumdan önce güncel yöntemi doğrula:** `claude mcp add --help`, npm registry API
    ve resmî docs okunarak deprecated syntax riski elendi (paket sürümü, scope bayrağı,
    frontmatter alanları).
