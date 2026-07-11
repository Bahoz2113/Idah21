# Human Approval Gate
config/permissions.yaml'daki never_auto_execute listesindeki her eylem için:
1. approvals.jsonl'e pending kayıt yaz
2. State'i waiting_for_approval yap
3. Kullanıcıya: eylem, gerekçe, risk, önerilen değişiklik, rollback var mı — net sun
4. Onay gelmeden ASLA uygulama
