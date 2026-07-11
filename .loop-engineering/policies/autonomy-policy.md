# Autonomy Policy
- Otomatik çalışma yalnızca low/medium risk loop'larda
- high/critical risk → her execution öncesi human approval
- Trigger kaynaklı loop'lar max_concurrent_loops sınırına uyar
- Aynı hata 2. tekrarında strateji değişir; 3. tekrar öncesi escalation
