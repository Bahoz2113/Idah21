# anti patterns

- [2026-07-11T08:19:35.632Z] loop:loop-mrg3fyku-cd000d | generic-improvement: Bütçe testi | score:10.5 | template:generic-improvement

- [2026-07-11T08:19:35.842Z] loop:loop-mrg3fyqh-e1c22a | generic-improvement: Tekrar hata testi | score:10.5 | template:generic-improvement

- [2026-07-11T08:19:36.085Z] loop:loop-mrg3fywg-7c537b rollback → cp-mrg3fyxk-0baafd

- [2026-07-11T08:19:56.383Z] loop:loop-mrg3gel9-e19392 | generic-improvement: Bütçe testi | score:10.5 | template:generic-improvement

- [2026-07-11T08:19:56.552Z] loop:loop-mrg3gepw-778c27 | generic-improvement: Tekrar hata testi | score:10.5 | template:generic-improvement

- [2026-07-11T08:19:56.712Z] loop:loop-mrg3geum-55076c rollback → cp-mrg3gevp-28bf1c

- [2026-08-13] loop:loop-mss0zehh-ca54d8 — YAML frontmatter tırnak tuzağı
  SKILL.md frontmatter'ında bir değeri `"` ile BAŞLATIP devamında virgülle başka tırnaklı
  ifadeler yazmak (`when_to_use: "detaylı araştır", "karşılaştır" ...`) YAML'ı bozar:
  parser bunu quoted-scalar sanar, kapanış tırnağından sonrası hata verir ve **tüm
  frontmatter geçersiz olur**. Sonuç: Claude Code `description`'ı okuyamaz, skill'i gövde
  metninden fallback bir adla listeler — sessiz bozulma.
  Çözüm: değeri tırnakla başlatma (`when_to_use: Kapsamlı görevlerde — "detaylı araştır", ...`).
  Kalıcı önlem: `validateSkillFrontmatter()` — bir değer tırnakla başlayıp aynı karakterle
  bitmiyorsa hata ver. install + healthcheck bu doğrulamayı çalıştırıyor.

- [2026-08-13] loop:loop-mss0zehh-ca54d8 — dry-run'da yanıltıcı mesaj
  `--dry-run` modunda "silindi" / doğrulama "dosya yok" gibi gerçeği yansıtmayan çıktılar
  üretmek. Dry-run diske yazmaz; doğrulama adımı da hedef dosya yerine KAYNAK dosyayı
  denetlemeli, mesajlar gelecek zaman ("silinecek") olmalı. Aksi hâlde dry-run hem yanlış
  bilgi verir hem de hatalı çıkış koduyla biter.
