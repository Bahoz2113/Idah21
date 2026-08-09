"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { observeWorld } from "../world/progress";

/**
 * SIRAYLA AÇILAN BÖLÜM.
 *
 * Alternatif düzenin fikri şu: sayfa bir yığın bölüm değil, sırayla
 * açılan perdelerdir. Bölüme yaklaşıldığında künyesi önce belirir,
 * hemen ardından gövdesi açılır.
 *
 * Kritik karar: gövde AÇILIRKEN YÜKSEKLİK DEĞİŞMEZ.
 *
 * "Açılma"yı `max-height` ile yapmak ilk akla gelen yoldur ve yanlıştır.
 * Müfredat bölümü 165 haftalık ders planı taşıyor; yüksekliği animasyonla
 * büyütmek hem her karede yeniden düzen hesabı demek hem de kullanıcı
 * hâlâ kaydırırken sayfanın ayağının altından kayması demek. Bunun
 * yerine gövde her zaman yerini kaplar; yalnızca GÖRÜNÜRLÜĞÜ açılır:
 * saydamlıktan gelir, hafifçe yükselir, bulanıklığı çözülür.
 *
 * Sonuç aynı: aşağı indikçe bölümler sırayla açılıyor. Fark: hiçbir
 * düzen kayması (CLS) yok ve scroll konumu hiç zıplamıyor.
 *
 * Bir kez açılan bölüm KAPANMAZ. Yukarı çıkarken bölümlerin tekrar
 * solması okumayı bozardı; geri dönen kullanıcı okuduğu şeyi olduğu
 * gibi bulur.
 */
export function SequenceChapter({
  id,
  headingId,
  index,
  last = false,
  masthead,
  children,
  narrow = false,
}: {
  id: string;
  headingId: string;
  /** Perde numarası — künyedeki sıra göstergesi. */
  index: number;
  last?: boolean;
  masthead: ReactNode;
  children: ReactNode;
  narrow?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Azaltılmış hareket isteyen kullanıcıda hiçbir şey gizlenmez:
    // bölümler doğrudan açık gelir.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(true);
      return;
    }

    // Neden IntersectionObserver DEĞİL:
    //
    // IO yalnızca kesişim eşiği AŞILDIĞINDA haber verir. Menüden bir
    // bölüme atlandığında ya da kaydırma çubuğu sürüklendiğinde aradaki
    // bölümler ekrana hiç girmeden geçilir — "görünmüyordu, hâlâ
    // görünmüyor" bir olay üretmez. O bölümler KALICI OLARAK KAPALI
    // kalıyordu; kullanıcı yukarı döndüğünde boş bir bölüm buluyordu.
    // Ölçümle yakalandı: mobilde sayfanın sonuna atlayınca yedi
    // bölümden biri hep kapalı kalıyordu.
    //
    // Bunun yerine konum her karede okunur. Maliyet görünenden düşük:
    // ölçüm zaten rAF ile kısıtlanmış tek bir dinleyicidir ve AÇILAN
    // bölüm kendi aboneliğini söker — sayfa okundukça ölçüm sayısı
    // yediden sıfıra iner.
    const stop = observeWorld(() => {
      // Üst kenar ekranın alt beşte birine girdiğinde açılır: kullanıcı
      // başlığı gördüğü an gövde de hazırdır. Atlanmış bölümde değer
      // negatiftir, koşul yine sağlanır.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.78) {
        setOpen(true);
        stop();
      }
    });

    return stop;
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={headingId}
      data-open={open ? "" : undefined}
      className={`czr-chapter czr-seq-chapter py-24 lg:py-32${
        last ? "" : " border-b border-white/8"
      }`}
    >
      <div className={`mx-auto px-6 lg:px-10 ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>
        <div className="czr-seq-masthead">
          {/* Perde numarası: gösterinin kaçıncı bölümündeyiz */}
          <span
            aria-hidden="true"
            className="czr-mono mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-czr-ice/35"
          >
            <span className="tabular-nums text-czr-orange">
              {String(index).padStart(2, "0")}
            </span>
            <span className="h-px w-12 bg-white/15" />
          </span>

          {masthead}
        </div>

        <div className="czr-seq-body">{children}</div>
      </div>
    </section>
  );
}
