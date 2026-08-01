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
      camera={{ position: [0, 0, 13], fov: 40 }}
      // Dekoratif katman — ekran okuyucular sahneyi görmez, metin DOM'da zaten var.
      aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}
    >
      {/*
        Işık dengesi, "void %80 · navy %15 · ignition %5" oranına tabidir.
        Turuncu nokta ışık güçlü tutulduğunda dişliler kahverengiye dönüyor ve
        kadrajın yarısını turuncuya boyuyor — kuralın ihlali. Turuncu yalnızca
        kenar vurgusu olarak kalacak kadar bırakıldı.
      */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[7, 9, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-7, -3, 4]} intensity={26} color="#1a237e" />
      <pointLight position={[5, -5, 1]} intensity={2.4} color="#ff6f00" />
      <GearCluster heat={0.02} />
    </Canvas>
  );
}
