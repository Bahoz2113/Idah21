import Link from "next/link";
import { org } from "@/lib/seo/site";

/**
 * MARKALI 404 — "rota haritada yok".
 *
 * Bu sayfa olmadan bilinmeyen adresin kaderi middleware'e kalıyordu ve
 * ziyaretçi İÇ YÖNETİM PANELİNİN giriş ekranına yönlendiriliyordu
 * (ölçüldü: /olmayan-sayfa → 307 → /login). Tanıtım sitesinin ziyaretçisi
 * panelin varlığını hiç görmemeli; yanlış adres de markanın dilinde
 * cevaplanmalı.
 *
 * TEK DİL: TÜRKÇE. 404 sınırına rota parametresi ulaşmaz (Next `params`
 * vermez), yani istenen dil burada bilinemez. Kanonik dilde kalmak,
 * dört dilde tahmin yürütmekten dürüst.
 *
 * Sayfa bilinçli olarak hafif: gezinme çubuğu, video, animasyon yok.
 * Yanlış adrese düşen insanın tek işi doğru adrese dönmek.
 */
export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-[var(--color-surface-dark)] px-6">
      <div className="w-full max-w-2xl">
        <p className="scrub-mono text-[11px] uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">
          Hata 404 — Rota Haritada Yok
        </p>

        <h1 className="scrub-display mt-6 text-balance text-white">
          Bu koordinatta
          <br />
          bir şey uçmuyor.
        </h1>

        <p className="mt-6 max-w-xl text-pretty leading-relaxed text-white/70">
          Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.
          {" "}
          {org.name} üssü yerinde duruyor — aşağıdan dönebilirsiniz.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-brand-accent)] px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-[#0a191d] transition duration-300 hover:brightness-110"
          >
            Üsse Dön
          </Link>
          <Link
            href="/#iletisim"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-7 py-3 text-[13px] font-semibold uppercase tracking-wide text-white transition duration-300 hover:border-[var(--color-brand-accent)]/60 hover:bg-white/5"
          >
            İletişim
          </Link>
        </div>
      </div>
    </main>
  );
}
