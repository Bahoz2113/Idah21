---
name: context-manager
description: Artefakt üretimi ve bağlam yönetimi becerisi. Uzun/çok adımlı işlerde neyin nerede tutulacağına karar verir; rapor, doküman, görselleştirme gibi paylaşılabilir çıktıları Artifact olarak yayınlar; bağlamı alt ajanlara devrederken kaybı önler. "Rapor çıkar", "özetle", "bunu paylaşılabilir hale getir", "context şişti" durumlarında kullanılır.
---

# Artifact + Context Management Skill

İki işi bir arada yürütür: **ne üretildiği** (artifact) ve **neyin hatırlandığı** (context).

## A. Artifact tarafı

### Ne zaman Artifact
Bir çıktının **izleyicisi** varsa — ekip raporu, başkasının izleyeceği plan, referans doküman, görselleştirme — terminal scrollback'te bırakmak teslim sayılmaz.

### Akış (zorunlu sıra)
1. `artifact-design` skill'ini yükle (Markdown çıktı için bile).
2. Grafik/chart varsa `dataviz`; diyagram varsa `artifact-diagramming`.
3. Runtime davranış (kayıt tutma, paylaşımlı state, dosya) gerekiyorsa `artifact-capabilities`.
4. `.html` dosyasını yaz (`<!doctype>/<html>/<head>/<body>` yazma — sarmalanır).
5. `Artifact` çağır: `file_path` + `favicon` + kısa `description`.
6. Güncelleme = **aynı file_path** ile tekrar yayın (aynı URL). Yeni path = yeni artefakt.

### Sabitler
- `<title>`: 2-4 kelimelik **isim**, açıklama değil.
- Tema duyarlı: light token'lar bare `:root`'ta; dark override `@media (prefers-color-scheme: dark)` + `:root[data-theme="dark"]`.
- Self-contained: CDN yok, CSS/JS inline, görseller `data:` URI (tek istisna Google Fonts).
- Geniş içerik (tablo/kod/diyagram) kendi `overflow-x:auto` kabında kayar; body yatay kaymaz.
- Yazmadığın dosyayı **tam okumadan** yayınlama.
- Gerçek kişi/kurum taklidi, sahte kayıt/makbuz/yorum → yayınlanmaz.

### Proje içi kalıcı çıktı
Paylaşım değil **repo hafızası** amaçlıysa Artifact değil dosya: `loops/<id>/reports/`, `memory/`, `docs/`.

## B. Context tarafı

### Bütçe hiyerarşisi
| Katman | Nerede | Ömür |
|---|---|---|
| Çalışma belleği | konuşma bağlamı | oturum, özetlenebilir |
| Oturum diski | scratchpad | oturum |
| Proje hafızası | `.loop-engineering/memory/`, `CLAUDE.md`, `.claude/skills/` | kalıcı (commit) |
| Yayın | Artifact URL | kalıcı, paylaşılabilir |

### Kurallar
1. **Bağlamı doldurma.** Büyük dosyayı tam okuma — `sed -n 'A,Bp'` ile ilgili aralık. Log'u `head/tail` ile kırp.
2. **Fan-out'u devret.** Çok dosyada arama → `Explore`/`Agent`; sana sonuç döner, dosya dökümü değil. (Kullanıcı istemedikçe Agent çağırma.)
3. **Kararı yaz, muhakemeyi değil.** Uzun işlerde ara kararlar `loops/<id>/plan.md` ve `events.jsonl`'e düşer — bağlam özetlense de kaybolmaz.
4. **Öğrenimi kalıcılaştır.** Tekrar eden bir çözüm/tuzak → `.loop-engineering/memory/`. Ham log ve hassas veri **asla** memory'e girmez (CLAUDE.md kural 9).
5. **Devrederken tam brief.** Alt ajana/oturuma iş verirken: hedef, kısıt, denenmişler, kabul kriteri, dosya yolları. Alt ajan senin bağlamını görmez.
6. **Oturum efemer.** Bu container kapanınca commit edilmemiş her şey gider — saklanacak şey önce commit edilir.

### Özetleme tetikleyicileri
Bağlam uzadığında iş bitirilmeye çalışılmaz; özetleme devreye girer ve devam edilir. Sen sadece **kalıcı olması gerekeni diske almış** olmalısın.
