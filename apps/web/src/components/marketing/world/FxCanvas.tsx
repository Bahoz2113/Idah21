"use client";

import { Canvas } from "@react-three/fiber";
import { CategoryFx } from "./CategoryFx";

/**
 * KATEGORİ EFEKT KATMANI.
 *
 * Dünyanın kendisi artık boyalı katmanlarla kuruluyor (`SceneParallax`);
 * WebGL'e kalan tek iş, katalogda açılan eğitimin animasyonu. Hangar
 * kabuğu, kapılar ve wordmark geometrisi sahneden çıkarıldı — resim
 * onları çok daha iyi anlatıyor ve prosedürel geometri yanında ucuz
 * kalıyordu.
 *
 * Böylece sayfada tek WebGL bağlamı kalır ve o bağlam yalnızca resmin
 * anlatamayacağı şeyi yapar: harekete kategoriye göre biçim vermek.
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

      <CategoryFx />
    </Canvas>
  );
}
