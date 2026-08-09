"use client";

import { Canvas } from "@react-three/fiber";
import { Atmosphere } from "./Atmosphere";
import { CameraDrift } from "./CameraDrift";
import { CategoryFx } from "./CategoryFx";
import { Wordmark } from "./Wordmark";

/**
 * CANLI KATMAN.
 *
 * Dünyanın mekânı boyalı katmanlarla kuruluyor (`SceneParallax`);
 * WebGL'e kalan iş, resmin yapamayacağı üç şey:
 *
 *   · WORDMARK — `CEZERÎ` dünyanın İÇİNDE durur; alt kenarı ön plan
 *     siluetlerinin arkasında kalır. Occlusion taklit değil, derinliğin
 *     ve DOM sıralamasının doğal sonucudur.
 *   · ATMOSFER — sayfanın her yerinde akan toz ve köz. Sahne bunsuz
 *     yalnızca kategori efekti oynarken canlıydı, arada donuyordu.
 *   · KATEGORİ EFEKTİ — katalogda açılan eğitimin animasyonu.
 *
 * Kamera da artık scroll saatinden besleniyor (`CameraDrift`): resimler
 * kayarken WebGL katmanı yerinde saymaz, ikisi aynı dünyada kalır.
 *
 * Hangar kabuğu, kapılar ve wordmark geometrisi sahneden çıkarıldı —
 * resim onları çok daha iyi anlatıyor ve prosedürel geometri yanında
 * ucuz kalıyordu. Böylece sayfada tek WebGL bağlamı kalır.
 *
 * Sahne şeffaftır (`alpha: true`) — arkasındaki boyalı dünya görünür.
 */
export default function FxCanvas({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas
      style={{ pointerEvents: "none" }}
      camera={{ position: [0, 2.4, 9], fov: lite ? 54 : 46, near: 0.1, far: 90 }}
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: !lite, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.65} color="#0F4C5C" />
      <directionalLight position={[5, 9, 6]} intensity={1.1} color="#CFE3E6" />
      <pointLight position={[3, 4, 3]} intensity={26} distance={26} color="#FF8C00" />

      <Wordmark />
      <Atmosphere lite={lite} />
      <CategoryFx />

      <CameraDrift lite={lite} />
    </Canvas>
  );
}
