# /loop-run
Bir iterasyon yürütür: execute → verify → score → decision gate.
- Önce implementer rolüyle işi yap, her kriter için evidence/acN-*.md üret
- Sonra: `node .loop-engineering/scripts/loop.mjs run <loop-id>`
- Stop conditions: contract.yaml içinde; CLI zorlar
