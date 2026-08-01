"use client";

import { Canvas } from "@react-three/fiber";
import { GearCluster } from "./Gears";

/**
 * TEK PAYLAŞILAN CANVAS.
 * S01, S02 ve S04 bu context'i paylaşacak — üç ayrı WebGL context açmak
 * mobilde context-loss demektir.
 *
 * GEO kuralı K4: bu bileşen yalnızca `/` rotasına yüklenir. İçerik
 * katmanındaki hiçbir sayfa three.js import etmez.
 */
export default function SceneCanvas() {
  return (
    <Canvas
      // Sürekli dönen dişliler var; F2'de scroll'a bağlanınca "demand"a çevrilecek.
      frameloop="always"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 9], fov: 42 }}
      // Dekoratif katman — ekran okuyucular sahneyi görmez, metin DOM'da zaten var.
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 5]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-6, -3, 3]} intensity={18} color="#1a237e" />
      <pointLight position={[3, -4, 2]} intensity={9} color="#ff6f00" />
      <GearCluster heat={0.12} />
    </Canvas>
  );
}
