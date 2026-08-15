---
criterion: ac11
status: pass
method: build_run
---
# Build ve tip kontrolü

    pnpm --filter web build
    EXIT=0

Tip hatası yok, "Failed to compile" yok. Tüm rotalar üretildi;
`/` statik (force-static) olarak prerender edildi.

Log: scratchpad/b5.log
