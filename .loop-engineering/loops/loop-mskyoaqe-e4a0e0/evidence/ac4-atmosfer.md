---
criterion: ac4
status: pass
method: file_check + browser_probe
---
# Sürekli atmosfer partikülleri

`world/HangarWorld.tsx` -> `Motes`: 700 parçacıklı BufferGeometry.
Her karede toz yükselir (y += 0.0016 + seed*0.0022), tavana ulaşınca
zemine döner; yatayda sinüs salınımı; scroll hızı `worldClock.velocity`
parçacıkları z ekseninde geriye sürükler — hareket sahneye bağlı, sabit
bir döngü animasyonu değil.

Materyal: AdditiveBlending, depthWrite=false, sizeAttenuation.

Durdurma koşulları:
- `lite` cihaz (mobil / deviceMemory < 6): `{lite ? null : <Motes />}`
- prefers-reduced-motion: sahnenin tamamı hiç yüklenmez (WorldStage kapısı)

Ölçüm: reducedMotion='reduce' bağlamında canvas -> false (bkz. ac6).
Tam dünyada 7 scroll durağı boyunca konsol hatası 0.
