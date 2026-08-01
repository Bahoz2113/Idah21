"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Prosedürel dişli geometrisi.
 * Hazır GLB yok — diş profili kod içinde üretilir. Sıfır asset ağırlığı,
 * cihaz sınıfına göre ölçeklenebilir detay.
 */
function makeGearShape(
  teeth: number,
  outerRadius: number,
  rootRadius: number,
  boreRadius: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.5;
    const a3 = a0 + step * 0.72;

    const x0 = Math.cos(a0) * rootRadius;
    const y0 = Math.sin(a0) * rootRadius;
    if (i === 0) shape.moveTo(x0, y0);
    else shape.lineTo(x0, y0);

    shape.lineTo(Math.cos(a1) * outerRadius, Math.sin(a1) * outerRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * rootRadius, Math.sin(a3) * rootRadius);
  }
  shape.closePath();

  const bore = new THREE.Path();
  bore.absarc(0, 0, boreRadius, 0, Math.PI * 2, true);
  shape.holes.push(bore);

  return shape;
}

export interface GearProps {
  teeth: number;
  outerRadius: number;
  rootRadius: number;
  boreRadius: number;
  thickness: number;
  /** Radyan/saniye. İşaret dönüş yönünü belirler — kavrayan dişliler zıt döner. */
  speed: number;
  position?: [number, number, number];
  /** 0 → soğuk metal, 1 → ateşleme turuncusu. S01'de scroll'a bağlanacak. */
  heat?: number;
}

export function Gear({
  teeth,
  outerRadius,
  rootRadius,
  boreRadius,
  thickness,
  speed,
  position = [0, 0, 0],
  heat = 0,
}: GearProps) {
  const ref = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const shape = makeGearShape(teeth, outerRadius, rootRadius, boreRadius);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: thickness * 0.08,
      bevelSize: thickness * 0.06,
      bevelSegments: 2,
      curveSegments: 4,
    });
    geo.center();
    return geo;
  }, [teeth, outerRadius, rootRadius, boreRadius, thickness]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += speed * delta;
  });

  return (
    <mesh ref={ref} geometry={geometry} position={position}>
      <meshStandardMaterial
        color="#1a1a1a"
        metalness={0.9}
        roughness={0.35}
        emissive="#ff6f00"
        emissiveIntensity={heat}
      />
    </mesh>
  );
}

/** S01 hero dişli kümesi — üç iç içe geçmiş dişli, gerçek oranla zıt yönlerde. */
export function GearCluster({ heat = 0 }: { heat?: number }) {
  return (
    <group>
      <Gear
        teeth={24}
        outerRadius={2.4}
        rootRadius={2.0}
        boreRadius={0.5}
        thickness={0.34}
        speed={0.18}
        position={[0, 0, 0]}
        heat={heat}
      />
      <Gear
        teeth={16}
        outerRadius={1.6}
        rootRadius={1.32}
        boreRadius={0.34}
        thickness={0.3}
        speed={-0.27}
        position={[3.5, 1.1, -0.4]}
        heat={heat}
      />
      <Gear
        teeth={12}
        outerRadius={1.2}
        rootRadius={0.98}
        boreRadius={0.26}
        thickness={0.26}
        speed={0.36}
        position={[-3.0, -1.4, -0.8]}
        heat={heat}
      />
    </group>
  );
}
