"use client";

import { useEffect, useRef } from "react";
import { observeWorld, worldClock } from "./progress";

/**
 * BOYALI DÜNYA — dört katmanlı parallax.
 *
 * Sahne artık prosedürel geometri değil, dört ayrı resim katmanı:
 * gök, hangar, apron, ön plan. Scroll ilerledikçe her katman FARKLI
 * hızda kayar ve ölçeklenir; derinlik hissi buradan gelir. En yakın
 * katman en hızlı hareket eder, gök neredeyse durur — göz mesafeyi
 * böyle okur.
 *
 * Kritik ayrıntı: ön plan katmanı içeriğin ÜSTÜNDE (z-20) durur.
 * `CEZERÎ` yazısı ve gövde metni arada kalır, ön plandaki pervane ve
 * dişli siluetleri harflerin önünden geçer. Occlusion sahte değil —
 * KAGE'deki çimen–harf ilişkisinin aynısı, DOM sıralamasıyla kurulur.
 *
 * Neden CSS, neden WebGL değil: dört düzlemi kaydırmak için shader
 * gerekmiyor. `transform` GPU'da çalışır, mobilde pil yakmaz, her
 * çözünürlükte nettir ve WebGL bağlamı olmayan cihazda da görünür.
 * WebGL yalnızca kategori animasyonları için ayrılmıştır.
 *
 * Konum yazımı React state'ine gitmez: scroll saniyede 60+ kez değişir,
 * her değişimde ağaç render edilseydi sayfa kilitlenirdi. Değerler
 * doğrudan `style.transform`'a yazılır.
 */

type Layer = {
  src: string;
  alt: "";
  /** Scroll boyunca dikey kayma miktarı (viewport yüksekliğinin oranı). */
  drift: number;
  /** Scroll boyunca büyüme miktarı. */
  zoom: number;
  className: string;
};

const LAYERS: Layer[] = [
  {
    // Gök neredeyse durur: en uzak düzlem.
    src: "/assets/sahne/sahne-gok.webp",
    alt: "",
    drift: 0.04,
    zoom: 0.06,
    className: "z-0 opacity-90",
  },
  {
    src: "/assets/sahne/sahne-hangar.webp",
    alt: "",
    drift: 0.1,
    zoom: 0.14,
    className: "z-[1] opacity-70",
  },
  {
    src: "/assets/sahne/sahne-apron.webp",
    alt: "",
    drift: 0.2,
    zoom: 0.22,
    className: "z-[2] opacity-55",
  },
];

/**
 * Ön plan ayrı: içeriğin üstünde çizilir, bu yüzden farklı katmanda.
 *
 * Kaynak plaka (`sahne-onplan.webp`) turuncu ışıkla çizilmiş siluetlerin
 * saf siyah üzerindeki hâliydi. İki sorunu vardı:
 *
 *   1. OPAKTI. Maskeyle yumuşatılıyordu ama maske dikey bir gradyandır,
 *      şekli değil bandı yumuşatır. Ekranın altında bir şerit duruyordu.
 *   2. DİKTİ (640×362). Siluetin tamamının görünmesi için ekranın yarısı
 *      gerekiyordu; alçak bir banda sıkıştırıldığında tepeleri kesiliyordu.
 *
 * `-serit` sürümü ikisini de çözer. Plakanın siluet bölgesi kesilip alfa
 * kanalı türetildi (her sütunda ışığın ilk göründüğü satırdan yukarısı
 * saydam; konturun üstüne taşan hâle kendi parlaklığıyla korundu), sonra
 * üç kopya dönüşümlü aynalanıp bindirilerek 7:1 oranında sürekli bir
 * makine sırtına dönüştürüldü. Böylece tüm siluet 18vh'lik bir banda
 * sığar ve tam genişlikteki piksel bütçesi üçe katlanır.
 *
 * Kayma payı bilerek küçük (0.42 → 0.12): saydam katman yukarı
 * kaydığında altında boşluk kalır. Kapsayıcı zaten aşağı taşırılmıştır,
 * bu pay onun içinde kalır.
 */
const FOREGROUND: Layer = {
  src: "/assets/sahne/sahne-onplan-serit.webp",
  alt: "",
  drift: 0.12,
  zoom: 0.14,
  className: "",
};

function useParallax(layers: Layer[]) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const stop = observeWorld(() => {
      const p = worldClock.progress;
      layers.forEach((l, i) => {
        const el = refs.current[i];
        if (!el) return;
        // Yukarı kayma + hafif yakınlaşma. Katman ne kadar yakınsa
        // ikisi de o kadar büyük.
        el.style.transform = `translate3d(0, ${(-p * l.drift * 100).toFixed(3)}%, 0) scale(${(1 + p * l.zoom).toFixed(4)})`;
      });
    });
    return stop;
  }, [layers]);

  return refs;
}

export function SceneParallax() {
  const backRefs = useParallax(LAYERS);

  return (
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        {LAYERS.map((l, i) => (
          <div
            key={l.src}
            ref={(el) => {
              backRefs.current[i] = el;
            }}
            className={`absolute inset-0 will-change-transform ${l.className}`}
            style={{
              backgroundImage: `url(${l.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center 62%",
              // Katmanlar üst üste binerken kenarları sert kesmesin:
              // her biri altındakine yumuşak geçsin.
              maskImage:
                i === 0
                  ? undefined
                  : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 100%)",
              WebkitMaskImage:
                i === 0
                  ? undefined
                  : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 26%, rgba(0,0,0,1) 100%)",
            }}
          />
        ))}
      </div>
  );
}

/**
 * ÖN PLAN — içeriğin ÜSTÜNDE çizilen katman.
 *
 * `.czr-world` kapsayıcısı `z-0` ve `contain: layout paint` taşır; bu
 * katman orada kalsaydı ne içeriğin üstüne çıkabilir ne de kapsayıcının
 * dışına taşabilirdi. Bu yüzden ayrı bir bileşen ve sayfa düzeyinde
 * kardeş olarak yerleştirilir.
 *
 * Pervane ve dişli siluetleri başlığın önünden geçer; derinlik buradan
 * doğar.
 *
 * Katman artık maskeyle kırpılmaz — görüntünün kendisi saydamdır. Bu
 * ikisi aynı şey değil: maske dikey bir gradyandır, silueti değil bandı
 * yumuşatır; alfa ise ŞEKLİ keser. Fark ekranda doğrudan görünür,
 * ön plan alttan gelen bir gölge olmaktan çıkıp mekânın parçası olur.
 *
 * Yükseklik ölçülü: 18vh. Hero'nun içeriği ilk ekranın altına taşacak
 * kadar uzun olduğu için ön plan orada eylem butonlarının üstüne
 * biniyordu — derinlik uğruna içeriğin okunurluğundan taviz verilmez.
 * Bu yüzden katman EŞİKTE neredeyse görünmez, dünyaya girildikçe
 * yoğunlaşır (`--czr-depth-fg`, bkz. `WorldFocus`).
 */
export function SceneForeground() {
  const frontRefs = useParallax([FOREGROUND]);

  return (
      <div
        aria-hidden="true"
        // Telefonda daha alçak: dar ekranda satırlar kısa, ekranın altındaki
        // her santimetre okunan metindir.
        className="czr-foreground pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[12vh] overflow-hidden sm:h-[18vh]"
      >
        <div
          ref={(el) => {
            frontRefs.current[0] = el;
          }}
          // Kapsayıcının altına taşar: katman yukarı kaydığında alt
          // kenarında boşluk açılmasın diye.
          className="absolute inset-x-0 -bottom-[20%] h-[140%] will-change-transform"
          style={{
            backgroundImage: `url(${FOREGROUND.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            // Büyürken taban sabit kalsın; merkezden ölçeklenseydi
            // siluetin alt kenarı ekranın dışına çıkardı.
            transformOrigin: "50% 100%",
          }}
        />
      </div>
  );
}
