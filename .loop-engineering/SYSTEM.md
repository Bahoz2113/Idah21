# Loop Engineering OS — Sistem Tanımı

Akış:
USER INTENT → INTENT NORMALIZATION → CONSTRAINT DISCOVERY → LOOP CONTRACT →
BASELINE → PLAN → AGENT SELECTION → EXECUTION → EVIDENCE → VERIFICATION →
SCORING → CRITIQUE → DECISION GATE (PASS/RETRY/BLOCKED/ROLLBACK/FAIL)

Self-improvement alt döngüsü:
OBSERVE → MEASURE → DIAGNOSE → HYPOTHESIZE → PLAN EXPERIMENT → EXECUTE →
VERIFY → COMPARE WITH BASELINE → ACCEPT/REJECT → LEARN

Net Improvement = New Verified Score − Baseline − Regression − Risk − Cost cezaları.

## Bileşenler
- contract.yaml: değiştirilemez sözleşme (revizyon = contract-history + diff + gerekçe)
- state.json: state machine (17 durum, tanımlı geçişler, atomic write)
- events.jsonl: append-only olay günlüğü (düzeltme = correction event)
- evidence/: her kabul kriteri için acN-*.md (status: pass + ham kanıt)
- checkpoints/: state+contract snapshot; rollback hedefi
- scores.jsonl / decisions.jsonl / failures.jsonl / approvals.jsonl

## Zorlamalar (CLI seviyesinde)
- Kanıtsız completion imkansız (verification pass şart)
- Verifier reddi → skor quality_threshold'u geçemez
- max_iterations aşımı → loop durur
- Aynı failure signature 3. kez → FAILED + escalation
- Geçersiz state geçişi → hata
- Lock + heartbeat + stale recovery → concurrency güvenliği
- Atomic write (tmp+rename) → yarım state dosyası imkansız
