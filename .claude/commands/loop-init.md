# /loop-init
Yeni loop oluşturur.
- Girdi: template adı + hedef cümlesi
- Ajanlar: intent-analyst → orchestrator
- Çalıştırır: `node .loop-engineering/scripts/loop.mjs init <template> "<objective>"`
- Günceller: loops/<id>/contract.yaml, state.json, plan.md
- Çıktı: loop-id + sonraki adım
