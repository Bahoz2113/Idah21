"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";

/**
 * Otonom VTOL — 3D exploded view.
 *
 * Bu dosya YALNIZCA `HeroScene` tarafından, ilk boyamadan sonra ve yalnızca
 * yeterli kapasitedeki cihazlarda dinamik olarak yüklenir. Bundle'ı kök
 * paketten uzak tutmak için hiçbir yerden statik import edilmemelidir.
 *
 * `drei` kasıtlı olarak kullanılmadı: ihtiyaç duyulan her şey (ışık, primitif
 * geometri, kamera) çekirdek three ile karşılanıyor ve bu ~150 KB'lık ek
 * bağımlılığı bundle'dan çıkarıyor.
 */

const TEAL = "#0F4C5C";
const TEAL_SOFT = "#1B6E7E";
const ORANGE = "#FF8C00";
const EMERALD = "#10B981";
const ICE = "#CFE3E6";

/** Dört kolun açısal yerleşimi (X düzeninde quadcopter). */
const ARMS = [
  { angle: Math.PI * 0.25, spin: 1 },
  { angle: Math.PI * 0.75, spin: -1 },
  { angle: Math.PI * 1.25, spin: 1 },
  { angle: Math.PI * 1.75, spin: -1 },
] as const;

type ArmProps = {
  angle: number;
  spin: number;
  explode: number;
};

function Arm({ angle, spin, explode }: ArmProps) {
  const rotor = useRef<Mesh>(null);
  const reach = 1.35;

  // Patlatma ilerledikçe kol merkezden uzaklaşır ve hafifçe yükselir.
  const x = Math.cos(angle) * (reach + explode * 0.9);
  const z = Math.sin(angle) * (reach + explode * 0.9);
  const y = explode * 0.28;

  useFrame((_, delta) => {
    if (rotor.current) {
      // Pervane, patlatma açıkken yavaşlar — "sökülmüş" hissi verir.
      rotor.current.rotation.y += delta * 14 * spin * (1 - explode * 0.75);
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Kol borusu */}
      <mesh rotation={[0, -angle, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, reach * 1.05, 12]} />
        <meshStandardMaterial color={TEAL_SOFT} metalness={0.65} roughness={0.35} />
      </mesh>

      {/* Motor gövdesi */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.14, 0.17, 0.24, 20]} />
        <meshStandardMaterial color={TEAL} metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Motor ışığı — ince turuncu bilezik */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 20]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.1} />
      </mesh>

      {/* Pervane — iki kanat */}
      <mesh ref={rotor} position={[0, 0.36 + explode * 0.5, 0]}>
        <boxGeometry args={[1.25, 0.018, 0.075]} />
        <meshStandardMaterial
          color={ICE}
          metalness={0.2}
          roughness={0.6}
          transparent
          opacity={0.62}
        />
      </mesh>
    </group>
  );
}

function Drone({ pointer }: { pointer: { x: number; y: number } }) {
  const group = useRef<Group>(null);
  const explodeRef = useRef(0);
  const [explode, setExplode] = useState(0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Patlatma döngüsü: 4 sn birleşik → açıl → bekle → kapan.
    const cycle = (t % 12) / 12;
    const target =
      cycle < 0.25 ? 0 : cycle < 0.45 ? (cycle - 0.25) / 0.2 : cycle < 0.75 ? 1 : 1 - (cycle - 0.75) / 0.25;

    // Kritik sönümleme yerine kare-hızından bağımsız üstel yumuşatma:
    // 120 Hz ekranda da 60 Hz'de de aynı hızda ilerler.
    const smoothing = 1 - Math.exp(-delta * 3.2);
    explodeRef.current += (target - explodeRef.current) * smoothing;

    // React state'i yalnızca gözle görülür değişimde güncellenir; her karede
    // setState çağırmak gereksiz render fırtınası yaratırdı.
    if (Math.abs(explodeRef.current - explode) > 0.01) setExplode(explodeRef.current);

    if (group.current) {
      group.current.rotation.y += delta * 0.22;
      // İmleç takibi — hafif, abartısız parallax
      group.current.rotation.x += (pointer.y * 0.18 - group.current.rotation.x) * smoothing;
      group.current.position.y = Math.sin(t * 0.9) * 0.12;
    }
  });

  return (
    <group ref={group} scale={1.05}>
      {/* Ana gövde */}
      <mesh position={[0, explode * -0.05, 0]} castShadow>
        <boxGeometry args={[1.05, 0.26, 1.05]} />
        <meshStandardMaterial color={TEAL} metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Üst kabuk — patlatmada yukarı ayrılır */}
      <mesh position={[0, 0.2 + explode * 0.75, 0]}>
        <boxGeometry args={[0.92, 0.12, 0.92]} />
        <meshStandardMaterial color={TEAL_SOFT} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Uçuş kontrol kartı — kabuk açılınca ortaya çıkan iç bileşen */}
      <mesh position={[0, 0.1 + explode * 0.34, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial
          color={EMERALD}
          emissive={EMERALD}
          emissiveIntensity={0.35 + explode * 1.1}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Gimbal kamera — patlatmada aşağı ayrılır */}
      <mesh position={[0, -0.26 - explode * 0.6, 0.18]}>
        <sphereGeometry args={[0.19, 20, 20]} />
        <meshStandardMaterial color="#0A191D" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[0, -0.26 - explode * 0.6, 0.34]}>
        <cylinderGeometry args={[0.075, 0.075, 0.06, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={ORANGE} emissive={ORANGE} emissiveIntensity={1.2} />
      </mesh>

      {/* Batarya — patlatmada geriye kayar */}
      <mesh position={[0, -0.02, -0.32 - explode * 0.85]}>
        <boxGeometry args={[0.46, 0.16, 0.3]} />
        <meshStandardMaterial color="#0D1F23" metalness={0.5} roughness={0.6} />
      </mesh>

      {ARMS.map((arm) => (
        <Arm key={arm.angle} angle={arm.angle} spin={arm.spin} explode={explode} />
      ))}
    </group>
  );
}

export default function DroneScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const lights = useMemo(
    () => (
      <>
        <ambientLight intensity={0.55} color={ICE} />
        <directionalLight position={[4, 6, 3]} intensity={1.5} color="#FFFFFF" />
        {/* Turuncu kenar ışığı — marka aksentini 3D'ye taşır */}
        <pointLight position={[-4, 1.5, -3]} intensity={22} color={ORANGE} distance={14} />
        {/* Petrol yeşili dolgu — koyu zeminle bütünleşme */}
        <pointLight position={[3, -2.5, 4]} intensity={16} color={TEAL_SOFT} distance={14} />
      </>
    ),
    [],
  );

  return (
    <Canvas
      // Kamera bilinçli olarak geride: sahne, manşetin sağındaki boşluğa
      // oturmalı, kadrajı doldurup metinle yarışmamalı.
      camera={{ position: [0, 2.1, 8.4], fov: 34 }}
      // Retina'da 2x'i aşmamak GPU yükünü yarıya indirir, fark gözle seçilmez.
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
        });
      }}
    >
      {lights}
      <Drone pointer={pointer} />
    </Canvas>
  );
}
