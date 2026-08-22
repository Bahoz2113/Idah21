---
name: code-interpreter
description: Kod yürütme ve analiz becerisi — hesaplama, veri işleme, algoritma doğrulama, prototip çalıştırma, çıktı karşılaştırma. "Bu hesap doğru mu", "şu veriyi işle", "bu fonksiyon ne döndürür", "performansı ölç" tipi işlerde; ve bir iddianın çalıştırılabilir kanıtla ispatlanması gerektiğinde kullanılır.
---

# Code Interpretation Skill

Amaç: **iddiayı çalıştırarak ispatlamak**. Tahmin edilen çıktı kanıt değildir.

## Ne zaman
- Sayısal hesap, veri dönüşümü, istatistik, format çevrimi.
- Algoritma/regex/parser davranışını doğrulama.
- Baseline ölçümü ve optimizasyon sonrası karşılaştırma.
- Bir hata teorisini minimal repro ile sınama.

## Yürütme
```bash
# tek seferlik hesap
python3 -c "..."          # veya  node -e "..."
# çok satırlı → scratchpad'e yaz, oradan çalıştır
cat > "$SCRATCH/probe.py" <<'PY'
...
PY
python3 "$SCRATCH/probe.py"
```
- Geçici script/veri **scratchpad dizinine** yazılır, proje dizinine değil.
- Bağımlılık kurulumu gerekiyorsa önce repo'nun kendi ortamını dene (`node_modules`, venv); global kurulum son çare ve onaya tabi.
- Notebook varsa `NotebookEdit`; hücre çıktısı kanıttır.

## Ölçüm disiplini (CLAUDE.md kural 5)
1. **Önce baseline.** Değişiklikten önce ölç ve kaydet.
2. Tek değişken değiştir.
3. Aynı komut, aynı girdi, aynı makine ile tekrar ölç.
4. Delta'yı ham sayılarla raporla; "daha hızlı" demek yetmez.
```markdown
baseline: 412ms (n=10, median)
after:    118ms (n=10, median)
delta:    -71.4%
method:   `node bench.mjs --runs 10`
```

## Doğrulama kuralları
- **Kenar durum zorunlu:** boş girdi, tek eleman, negatif, unicode, çok büyük girdi.
- Beklenen çıktı **önce** yazılır, sonra çalıştırılır — sonuca göre beklenti uydurulmaz.
- Çıktı beklentiyle uyuşmuyorsa: testi değil, teoriyi sorgula.
- Test asla `skip`/`disable`/`quarantine` edilerek yeşile boyanmaz.

## Aynı hata 2 kez → strateji değiştir (CLAUDE.md kural 8)
Aynı yaklaşımla ikinci kez başarısızlık: yaklaşımı değiştir. Üçüncü tekrar: `FAILED` + escalation.

## Güvenlik
- Kullanıcıdan/webden gelen kod körlemesine çalıştırılmaz; önce okunur.
- Ağ çağrısı yapan probe'lar açıkça belirtilir.
- Secret hiçbir probe çıktısına yazılmaz.
