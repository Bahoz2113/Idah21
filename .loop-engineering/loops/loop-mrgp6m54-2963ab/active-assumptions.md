# Active Assumptions — loop-mrgp6m54-2963ab

Design asamasinda dogrulanamayan ama plani ilerletmek icin kabul edilen varsayimlar.
Herhangi biri yanlis cikarsa ilgili task bloke edilir ve contract revize edilir.

| # | Varsayim | Dayanak | Yanlissa etki |
|---|----------|---------|---------------|
| A1 | Repoda calisan test paketi YOK. AYRICA `tsc --noEmit` **halihazirda kirli** (onlarca preexisting hata: cozulmeyen workspace tipleri, liste sayfasinda `includeArchived` + `??`/`||` mix). Bu nedenle "regresyon yok" = **DIFERANSIYEL**: bizim degisikligimizin YENI tsc hatasi eklememesi + `next lint` bizim dosyalarda temiz + gozle davranis kontrolu. Instrumentation olcumu: 0 yeni hata (dogrulandi). | `git ls-files` + package.json + `tsc --noEmit` ciktisi (T1) | ac3 diferansiyel tanima cevrildi (contract v2 ac3 guncellendi) |
| A2 | Gecis yavasliginin ana nedeni detay ekraninda cold `trpc.students.get.useQuery` — liste ekraninda prefetch yok. | Kod okuma: page.tsx (liste) Link'te prefetch yok; [id]/page.tsx mount'ta cold query + spinner | Kok neden farkliysa T2 stratejisi degisir |
| A3 | `trpc.useUtils()` uzerinden `utils.students.get.prefetch({id})` mevcut ve backend router imzasi degismeden warm cache saglar. | Liste zaten `trpc.useUtils()` kullaniyor; tRPC v11 + react-query v5 | Prefetch API yoksa alternatif (router prefetch) gerekir |
| A4 | Olcum ortami: `next dev`, local, warm server, tek sabit ogrenci id, N=20 kosu medyani. Baseline ve after AYNI ortamda. | Kullanici secimi (kod ici instrumentation) | Ortam kaymasi olcumu gecersiz kilar |
| A5 | Enstrumantasyon kodu (performance.mark/measure) yalnizca dev/olcum icin; production davranisini/bundle'i etkilemez veya olcum sonrasi geri alinir. | Iyi pratik | ac3 regresyon riski dogar |
| A6 | Detay ekranindaki ikincil cold query (`evaluations.graph`, Degerlendirme sekmesi) birincil TTFD metrigine dahil DEGIL; opsiyonel ikinci iyilestirme adayi. | Kod okuma: graph query tab mount'ta calisiyor | Kapsam genisleme karari gerekebilir |

Guncelleme: bir varsayim dogrulandiginda buraya "DOGRULANDI (evidence/...)" notu dusulur.
