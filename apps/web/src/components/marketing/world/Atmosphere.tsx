"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Points,
} from "three";
import { worldClock } from "./progress";

/**
 * ATMOSFER — dünyanın hiç durmayan havası.
 *
 * Boyalı katmanlar mekânı kurar ama hareketsizdir; kategori efektleri
 * ise yalnızca katalogda bir başlık açıkken oynar. Aradaki bütün
 * bölümlerde sahne donuyordu: sayfa "içinde yürünen bir mekân" olmaktan
 * çıkıp arkası resimli bir belgeye dönüyordu.
 *
 * Buradaki toz ve közler o boşluğu doldurur. Sayfanın neresinde olursanız
 * olun havada bir şey akar — mekân yaşamaya devam eder.
 *
 * İki ayrı sistem, çünkü ikisi farklı şey anlatır:
 *   · TOZ  — buz rengi, ince, kalabalık. Hangarın hacmini görünür kılar.
 *   · KÖZ  — turuncu, seyrek, iri. Atölyede bir şeyin çalıştığını söyler.
 *
 * Scroll hızı ikisini de geriye doğru sürükler (`worldClock.velocity`):
 * kaydırdığınızda içinden geçtiğinizi hissedersiniz. Değer React
 * state'inden değil doğrudan mutable saatten okunur — bu sistem saniyede
 * 60 kez çalışır, tek bir render bile fazladır.
 */

const ICE = "#CFE3E6";
const ORANGE = "#FF8C00";

type FieldSpec = {
  count: number;
  /** Yayılım kutusu: [genişlik, yükseklik, derinlik]. */
  spread: [number, number, number];
  /** Taban yükselme hızı. */
  rise: number;
  /** Yanal salınım genliği. */
  sway: number;
};

function useField({ count, spread, rise, sway }: FieldSpec) {
  const points = useRef<Points>(null);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0];
      pos[i * 3 + 1] = Math.random() * spread[1];
      pos[i * 3 + 2] = 12 - Math.random() * spread[2];
      seed[i] = Math.random();
    }

    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [count, spread]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!points.current) return;

    const t = state.clock.elapsedTime;
    const attr = geometry.getAttribute("position") as BufferAttribute;
    const seeds = geometry.getAttribute("aSeed") as BufferAttribute;

    // Scroll ne kadar hızlıysa hava o kadar geriye kaçar.
    const drag = worldClock.velocity * 110;

    for (let i = 0; i < count; i += 1) {
      const s = seeds.getX(i);

      let y = attr.getY(i) + rise * (0.55 + s);
      if (y > spread[1]) y = 0.05;
      attr.setY(i, y);

      attr.setX(i, attr.getX(i) + Math.sin(t * 0.3 + s * 14) * sway);

      let z = attr.getZ(i) + drag * (0.35 + s * 0.75);
      // Kutunun dışına çıkan parçacık öbür uçtan geri girer; alan
      // sonsuzmuş gibi davranır, yeniden üretim maliyeti yoktur.
      if (z > 13) z -= spread[2];
      else if (z < 12 - spread[2]) z += spread[2];
      attr.setZ(i, z);
    }

    attr.needsUpdate = true;
  });

  return { points, geometry };
}

function Dust({ count }: { count: number }) {
  const { points, geometry } = useField({
    count,
    spread: [34, 9.5, 54],
    rise: 0.0018,
    sway: 0.0016,
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.034}
        color={ICE}
        transparent
        opacity={0.42}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

function Embers({ count }: { count: number }) {
  const { points, geometry } = useField({
    count,
    spread: [26, 8, 40],
    rise: 0.0042,
    sway: 0.0034,
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.085}
        color={ORANGE}
        transparent
        opacity={0.32}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/**
 * Telefonda alan küçültülür ama KAPATILMAZ. Havası olmayan bir mekân
 * mobilde de ölü görünür; ziyaretçilerin çoğu oradan geliyor.
 */
export function Atmosphere({ lite = false }: { lite?: boolean }) {
  return (
    <>
      <Dust count={lite ? 150 : 420} />
      <Embers count={lite ? 26 : 64} />
    </>
  );
}
