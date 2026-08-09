"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { CanvasTexture, type Mesh } from "three";
import { worldClock } from "./progress";

/**
 * DÜNYANIN İÇİNDEKİ WORDMARK.
 *
 * `CEZERÎ` sahnenin içinde, boyalı katmanlarla ön plan siluetinin
 * ARASINDA duran bir düzlemdir. Alt kenarı makine sırtının arkasında
 * kalır; harfleri örten şey bir CSS maskesi değil, DOM sıralamasının ve
 * derinliğin doğal sonucudur:
 *
 *     boyalı katmanlar   z-0 … z-2   (gök, hangar, apron)
 *     WebGL sahnesi      z-3         (burası)
 *     bölüm içeriği      z-10
 *     ön plan siluetleri z-20        (harflerin ÖNÜNDEN geçer)
 *
 * Prosedürel hangar sahneden çıkarken bu düzlem de gitmişti; dünyanın
 * ölçeği onunla birlikte kayboldu. Boyalı plakalar mekânı anlatıyor ama
 * mekânın NE KADAR büyük olduğunu söyleyen şey harflerdi.
 *
 * Font yükleyici yerine canvas dokusu: ~200 kB'lık bir typeface
 * indirmesi de FOUT da yok. Harfler içi boş çizilir — dolu bir blok
 * arkasındaki sahneyi kapatır, kontur ise ışık izi gibi durur.
 */

function useWordmarkTexture(text: string) {
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;

    const w = 2048;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, w, h);
    ctx.font = `700 ${Math.round(h * 0.72)}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "28px";

    ctx.strokeStyle = "rgba(207, 227, 230, 0.9)";
    ctx.lineWidth = 6;
    ctx.strokeText(text, w / 2, h / 2 + 8);

    ctx.fillStyle = "rgba(207, 227, 230, 0.08)";
    ctx.fillText(text, w / 2, h / 2 + 8);

    const t = new CanvasTexture(canvas);
    t.anisotropy = 4;
    return t;
  }, [text]);

  useEffect(() => () => tex?.dispose(), [tex]);

  return tex;
}

/**
 * Eşikteki yükseklik. Hero'nun gövde metni sol kolonu tutuyor; harfler
 * bu yükseklikte metnin sağ kenarını hiç kesmez.
 */
const BASE_Y = -0.95;

export function Wordmark() {
  const tex = useWordmarkTexture("CEZERÎ");
  const mesh = useRef<Mesh>(null);

  useFrame(() => {
    if (!mesh.current) return;

    // Eşikte en güçlü; dünyaya girildikçe geride kalır. p = 0.20'den
    // sonra tamamen söner: aşağıdaki bölümler yoğun metin taşır, orada
    // arkada duran dev harfler okumayı yorar. Ayrıca kategori efektleri
    // p = 0.12'den itibaren aynı bölgeye giriyor; ikisi üst üste
    // binmesin diye söniş erken tamamlanır.
    const p = worldClock.progress;
    const fade = 1 - Math.min(1, Math.max(0, (p - 0.03) / 0.17));

    // Harfler kameradan HIZLI iner: dünyaya girildikçe wordmark makine
    // sırtının arkasına gömülür. Occlusion'ın gerçekten görüldüğü an
    // budur — ayakları siluetin arkasında kaybolurken tepesi hâlâ
    // dışarıdadır. Kamera tek başına bu inişi veremezdi, yükselişi
    // fazla yavaş.
    mesh.current.position.y = BASE_Y - p * 26;

    const mat = mesh.current.material as { opacity: number };
    mat.opacity = fade * 0.55;
    mesh.current.visible = fade > 0.01;
  });

  if (!tex) return null;

  return (
    // Konum iki kısıtın kesişimi:
    //   · YETERİNCE AŞAĞIDA — harflerin ayakları makine sırtının
    //     arkasında kalsın; occlusion'ın gerçek olduğu yer burası.
    //   · SAĞDA — hero'nun metin bloğu sol kolonu tutuyor; harfler
    //     ortada dursaydı gövde metninin arkasına girer, okumayı bozardı.
    <mesh ref={mesh} position={[3.5, BASE_Y, -7]} scale={[13.5, 3.4, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
