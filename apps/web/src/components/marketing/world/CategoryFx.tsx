"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  type Group,
  type Mesh,
  type Points,
} from "three";
import { worldClock } from "./progress";

/**
 * KATEGORİ EFEKTLERİ — katalogda açılan eğitimin sahnedeki karşılığı.
 *
 * "Roketçilik"i açtığınızda arkada roket kalkar, "İHA"da sürü uçar,
 * "Yapay Zeka"da sinir ağı ateşlenir. Her efekt PROSEDÜREL'dir: video
 * dokusu değil, geometri ve matematik.
 *
 * Bu tercihin üç nedeni var:
 *   1. Okunabilirlik. Efektin parlaklığı, yoğunluğu ve konumu her karede
 *      denetlenebilir; metnin arkasında kalması tesadüfe bırakılmaz.
 *      Video dokusunda kadrajın hangi anda parlayacağı bilinemez.
 *   2. Ağırlık. 10 kategori için 10 video onlarca MB ederdi ve mobilde
 *      aynı anda çözülemezdi. Buradaki her efekt birkaç yüz üçgen.
 *   3. Keskinlik. Geometri her çözünürlükte net; video ölçeklenince bozulur.
 *
 * Yalnızca AKTİF efekt sahneye eklenir; diğerleri hiç oluşturulmaz.
 * Her efekt zamanını sahne saatinden alır (`state.clock.elapsedTime`),
 * prop'tan değil — prop render anında donar, animasyon donuk kalırdı.
 */

const ORANGE = "#FF8C00";
const EMERALD = "#10B981";
const ICE = "#CFE3E6";
const TEAL_SOFT = "#1B6E7E";

/**
 * Efekt merkezi.
 *
 * Eğitimler durağında kamera z = 11 → 3.5 arasında ilerler. Efekti
 * z = -2'ye koymak onu 5-13 birim öne yerleştirir: metnin sağ boşluğunu
 * dolduracak kadar yakın, okumayı bozmayacak kadar uzak. Daha geride
 * (z = -9) duran ilk yerleşimde roket birkaç piksel kalıyordu.
 */
const ORIGIN: [number, number, number] = [3.2, 3.4, -2];

/* ------------------------------------------------------------------ *
 * Roketçilik — kalkış, tırmanış, tepe, paraşütle iniş
 * ------------------------------------------------------------------ */

function RocketFx() {
  const rocket = useRef<Group>(null);
  const chute = useRef<Mesh>(null);
  const flame = useRef<Mesh>(null);
  const trail = useRef<Points>(null);

  const trailGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(150 * 3), 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // 9 sn'lik döngü: 0-1 hazırlık, 1-5 tırmanış, 5+ tepe ve iniş.
    const cycle = t % 9;
    const climb = Math.min(1, Math.max(0, (cycle - 1) / 4));
    const descending = cycle > 5;
    const y = descending
      ? -1.6 + 9.2 - (cycle - 5) * 1.9
      : -1.6 + Math.pow(climb, 0.78) * 9.2;

    if (rocket.current) {
      rocket.current.position.set(Math.sin(climb * 2.4) * 0.35, y, 0);
      rocket.current.rotation.z = descending ? 0 : -Math.sin(climb * 2.4) * 0.16;
      rocket.current.visible = cycle > 0.6;
    }
    if (flame.current) {
      flame.current.visible = !descending && cycle > 0.9;
      flame.current.scale.y = 0.7 + Math.sin(t * 30) * 0.25;
    }
    if (chute.current) {
      const open = descending ? Math.min(1, (cycle - 5) / 0.7) : 0;
      chute.current.scale.setScalar(0.001 + open * 1.5);
      chute.current.visible = open > 0.01;
    }
    if (trail.current) {
      const attr = trailGeo.getAttribute("position") as BufferAttribute;
      for (let i = attr.count - 1; i > 0; i -= 1) {
        attr.setXYZ(i, attr.getX(i - 1), attr.getY(i - 1), attr.getZ(i - 1));
      }
      attr.setXYZ(0, rocket.current?.position.x ?? 0, y - 0.9, 0);
      attr.needsUpdate = true;
    }
  });

  return (
    <group position={ORIGIN}>
      <points ref={trail} geometry={trailGeo}>
        <pointsMaterial
          size={0.15}
          color={ICE}
          transparent
          opacity={0.26}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>

      <group ref={rocket}>
        <mesh>
          <cylinderGeometry args={[0.17, 0.17, 1.5, 16]} />
          <meshStandardMaterial color={ICE} roughness={0.4} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.98, 0]}>
          <coneGeometry args={[0.17, 0.5, 16]} />
          <meshStandardMaterial color={ORANGE} roughness={0.3} metalness={0.45} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -0.66, 0]} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.04, 0.42, 0.3]} />
            <meshStandardMaterial color={TEAL_SOFT} roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
        <mesh ref={flame} position={[0, -1.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.13, 0.8, 12]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.7} />
        </mesh>
        <mesh ref={chute} position={[0, 1.4, 0]}>
          <sphereGeometry args={[0.6, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color={ORANGE} transparent opacity={0.36} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * İHA / VTOL — sürü hâlinde devriye
 * ------------------------------------------------------------------ */

const SWARM = [
  { r: 3.0, s: 0.5, y: 1.2, p: 0 },
  { r: 4.2, s: -0.36, y: -0.6, p: 2.1 },
  { r: 2.2, s: 0.68, y: -1.7, p: 4.2 },
  { r: 5.0, s: 0.28, y: 2.2, p: 1.1 },
];

function DroneFx() {
  const units = useRef<Group[]>([]);
  const rotors = useRef<Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    SWARM.forEach((d, i) => {
      const g = units.current[i];
      if (!g) return;
      const a = t * d.s + d.p;
      g.position.set(Math.cos(a) * d.r, d.y + Math.sin(t * 1.1 + d.p) * 0.26, Math.sin(a) * d.r * 0.5);
      g.rotation.y = -a + Math.PI / 2;
      g.rotation.z = Math.sin(a) * 0.13;
    });
    for (const r of rotors.current) if (r) r.rotation.y = t * 20;
  });

  return (
    <group position={ORIGIN}>
      {SWARM.map((d, i) => (
        <group
          key={d.p}
          ref={(el) => {
            if (el) units.current[i] = el;
          }}
          scale={0.42}
        >
          <mesh>
            <boxGeometry args={[1.1, 0.18, 0.7]} />
            <meshStandardMaterial color="#0E2F38" roughness={0.42} metalness={0.7} />
          </mesh>
          {[0.25, 0.75, 1.25, 1.75].map((a, k) => (
            <group key={a} position={[Math.cos(a * Math.PI) * 0.85, 0.12, Math.sin(a * Math.PI) * 0.85]}>
              <mesh>
                <cylinderGeometry args={[0.1, 0.1, 0.12, 10]} />
                <meshStandardMaterial color={ORANGE} roughness={0.35} metalness={0.5} />
              </mesh>
              <group
                ref={(el) => {
                  if (el) rotors.current[i * 4 + k] = el;
                }}
                position={[0, 0.1, 0]}
              >
                <mesh>
                  <boxGeometry args={[0.95, 0.012, 0.05]} />
                  <meshBasicMaterial color={ICE} transparent opacity={0.3} />
                </mesh>
              </group>
            </group>
          ))}
          <mesh position={[0.6, 0, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={EMERALD} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Yapay zeka — katmanlı ağ, ileri besleme dalgası
 * ------------------------------------------------------------------ */

const LAYERS = [4, 6, 6, 3];

function NeuralFx() {
  const nodes = useMemo(() => {
    const out: { pos: [number, number, number]; layer: number }[] = [];
    LAYERS.forEach((count, l) => {
      for (let i = 0; i < count; i += 1) {
        out.push({
          pos: [(l - (LAYERS.length - 1) / 2) * 2.5, (i - (count - 1) / 2) * 1.05, 0],
          layer: l,
        });
      }
    });
    return out;
  }, []);

  const edges = useMemo(() => {
    const pts: number[] = [];
    for (let l = 0; l < LAYERS.length - 1; l += 1) {
      const a = nodes.filter((n) => n.layer === l);
      const b = nodes.filter((n) => n.layer === l + 1);
      for (const p of a) for (const q of b) pts.push(...p.pos, ...q.pos);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, [nodes]);

  const group = useRef<Group>(null);
  const cells = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = Math.sin(t * 0.18) * 0.28;

    // İleri besleme: katmanlar sırayla ateşlenir.
    const wave = (t * 0.85) % (LAYERS.length + 1);
    nodes.forEach((n, i) => {
      const m = cells.current[i];
      if (!m) return;
      const lit = Math.max(0, 1 - Math.abs(wave - n.layer) * 1.4);
      m.scale.setScalar(0.12 + lit * 0.13);
      (m.material as { color: { set: (c: string) => void } }).color.set(
        lit > 0.4 ? ORANGE : TEAL_SOFT,
      );
    });
  });

  return (
    <group position={ORIGIN} ref={group}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={TEAL_SOFT} transparent opacity={0.15} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh
          key={i}
          position={n.pos}
          ref={(el) => {
            if (el) cells.current[i] = el;
          }}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color={TEAL_SOFT} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Robotik — çizgi izleyen robot ve tarama konisi
 * ------------------------------------------------------------------ */

function RobotFx() {
  const bot = useRef<Group>(null);
  const scan = useRef<Mesh>(null);
  const wheels = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (bot.current) {
      const a = t * 0.42;
      bot.current.position.set(Math.cos(a) * 3.3, -1.5, Math.sin(a) * 1.7);
      bot.current.rotation.y = -a + Math.PI / 2;
    }
    for (const w of wheels.current) if (w) w.rotation.x = t * 6;
    if (scan.current) {
      (scan.current.material as { opacity: number }).opacity =
        0.1 + (Math.sin(t * 3) * 0.5 + 0.5) * 0.15;
    }
  });

  return (
    <group position={ORIGIN}>
      {/* İzlenen çizgi */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, 0]} scale={[1, 0.52, 1]}>
        <ringGeometry args={[3.2, 3.34, 56]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.2} />
      </mesh>

      <group ref={bot} scale={0.62}>
        <mesh>
          <boxGeometry args={[1.2, 0.4, 0.9]} />
          <meshStandardMaterial color="#123840" roughness={0.5} metalness={0.6} />
        </mesh>
        {[-0.5, 0.5].map((x, xi) =>
          [-0.5, 0.5].map((z, zi) => (
            <mesh
              key={`${x}:${z}`}
              position={[x, -0.24, z]}
              rotation={[0, 0, Math.PI / 2]}
              ref={(el) => {
                if (el) wheels.current[xi * 2 + zi] = el;
              }}
            >
              <cylinderGeometry args={[0.2, 0.2, 0.12, 12]} />
              <meshStandardMaterial color="#0A191D" roughness={0.9} metalness={0.1} />
            </mesh>
          )),
        )}
        <mesh ref={scan} position={[0.95, 0.1, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.55, 1.4, 14, 1, true]} />
          <meshBasicMaterial color={EMERALD} transparent opacity={0.16} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * 3D baskı — katman katman yükselen parça
 * ------------------------------------------------------------------ */

const PRINT_LAYERS = 26;

function PrintFx() {
  const head = useRef<Mesh>(null);
  const layers = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const built = ((t % 12) / 12) * PRINT_LAYERS;

    layers.current.forEach((m, i) => {
      if (!m) return;
      const grow = Math.min(1, Math.max(0, built - i));
      m.visible = grow > 0.001;
      m.scale.set(grow, 1, grow);
    });

    if (head.current) {
      head.current.position.y = -1.5 + Math.min(PRINT_LAYERS, built) * 0.14;
      head.current.position.x = Math.sin(t * 5) * 0.9;
    }
  });

  return (
    <group position={ORIGIN}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.66, 0]}>
        <planeGeometry args={[5.4, 5.4]} />
        <meshStandardMaterial color="#0C2229" roughness={0.9} metalness={0.15} />
      </mesh>

      {Array.from({ length: PRINT_LAYERS }, (_, i) => {
        const r = 1.5 - Math.abs(i - PRINT_LAYERS / 2) * 0.05;
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) layers.current[i] = el;
            }}
            position={[0, -1.5 + i * 0.14, 0]}
          >
            <cylinderGeometry args={[r, r, 0.12, 26]} />
            <meshStandardMaterial color={ORANGE} roughness={0.62} metalness={0.2} />
          </mesh>
        );
      })}

      <mesh ref={head}>
        <boxGeometry args={[0.5, 0.32, 0.5]} />
        <meshStandardMaterial color={ICE} roughness={0.35} metalness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Yazılım — akan kod sütunları
 * ------------------------------------------------------------------ */

const CODE_COLS = 26;
const CODE_ROWS = 14;

function CodeFx() {
  const points = useRef<Points>(null);

  const geo = useMemo(() => {
    const n = CODE_COLS * CODE_ROWS;
    const pos = new Float32Array(n * 3);
    const speed = new Float32Array(n);
    let i = 0;
    for (let c = 0; c < CODE_COLS; c += 1) {
      for (let r = 0; r < CODE_ROWS; r += 1) {
        pos[i * 3] = (c - CODE_COLS / 2) * 0.52;
        pos[i * 3 + 1] = (r - CODE_ROWS / 2) * 0.6;
        pos[i * 3 + 2] = -Math.random() * 2;
        speed[i] = 0.4 + Math.random() * 1.1;
        i += 1;
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSpeed", new BufferAttribute(speed, 1));
    return g;
  }, []);

  useFrame((state) => {
    const attr = geo.getAttribute("position") as BufferAttribute;
    const sp = geo.getAttribute("aSpeed") as BufferAttribute;
    for (let i = 0; i < attr.count; i += 1) {
      let y = attr.getY(i) - sp.getX(i) * 0.034;
      if (y < -4.4) y = 4.4;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    if (points.current) points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.13;
  });

  return (
    <group position={ORIGIN}>
      <points ref={points} geometry={geo}>
        <pointsMaterial
          size={0.1}
          color={EMERALD}
          transparent
          opacity={0.46}
          sizeAttenuation
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Elektronik — devre yolları ve üzerinde akan sinyal
 * ------------------------------------------------------------------ */

function CircuitFx() {
  // Yollar deterministik üretilir: her yenilemede aynı devre çizilir,
  // rastgele bir görüntü değil tanınabilir bir kart deseni olur.
  const paths = useMemo(() => {
    const rnd = (() => {
      let seed = 1337;
      return () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    })();

    return Array.from({ length: 7 }, (_, i) => {
      const pts: [number, number][] = [];
      let x = -5.6;
      let y = (i - 3) * 1.05;
      pts.push([x, y]);
      for (let s = 0; s < 6; s += 1) {
        x += 1.1 + rnd() * 0.7;
        pts.push([x, y]);
        if (rnd() > 0.45) {
          y += (rnd() > 0.5 ? 1 : -1) * 0.55;
          pts.push([x, y]);
        }
      }
      return pts;
    });
  }, []);

  const geos = useMemo(
    () =>
      paths.map((pts) => {
        // lineSegments ikili uçlar ister: her komşu çift bir parça.
        const arr: number[] = [];
        for (let i = 0; i < pts.length - 1; i += 1) {
          arr.push(pts[i][0], pts[i][1], 0, pts[i + 1][0], pts[i + 1][1], 0);
        }
        const g = new BufferGeometry();
        g.setAttribute("position", new BufferAttribute(new Float32Array(arr), 3));
        return g;
      }),
    [paths],
  );

  const pulses = useRef<Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    paths.forEach((pts, i) => {
      const m = pulses.current[i];
      if (!m) return;
      const k = ((t * 0.4 + i * 0.16) % 1) * (pts.length - 1);
      const a = Math.floor(k);
      const f = k - a;
      const [ax, ay] = pts[a];
      const [bx, by] = pts[Math.min(a + 1, pts.length - 1)];
      m.position.set(ax + (bx - ax) * f, ay + (by - ay) * f, 0.03);
    });
  });

  return (
    <group position={ORIGIN}>
      {geos.map((g, i) => (
        <lineSegments key={i} geometry={g}>
          <lineBasicMaterial color={TEAL_SOFT} transparent opacity={0.4} />
        </lineSegments>
      ))}
      {paths.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) pulses.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={ORANGE} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Siber güvenlik — darbe alan ve tutan kalkan
 * ------------------------------------------------------------------ */

function ShieldFx() {
  const shield = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // 4 saniyede bir darbe: kalkan parlar, sonra toparlanır.
    const hit = Math.max(0, 1 - (t % 4) / 0.55);
    if (shield.current) {
      shield.current.rotation.y = t * 0.24;
      shield.current.rotation.x = Math.sin(t * 0.16) * 0.2;
      shield.current.scale.setScalar(1 + hit * 0.13);
      (shield.current.material as { opacity: number }).opacity = 0.14 + hit * 0.38;
    }
    if (ring.current) {
      const grow = (t % 4) / 4;
      ring.current.scale.setScalar(0.6 + grow * 3.6);
      (ring.current.material as { opacity: number }).opacity = Math.max(0, 0.45 - grow * 0.45);
    }
  });

  return (
    <group position={ORIGIN}>
      <mesh ref={shield}>
        <icosahedronGeometry args={[2.3, 1]} />
        <meshBasicMaterial color={EMERALD} wireframe transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1, 1.06, 44]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.4} side={DoubleSide} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={TEAL_SOFT} roughness={0.4} metalness={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Uzay — yörüngede uydu
 * ------------------------------------------------------------------ */

function OrbitFx() {
  const sat = useRef<Group>(null);
  const planet = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (sat.current) {
      const a = t * 0.4;
      sat.current.position.set(Math.cos(a) * 4.1, Math.sin(a * 0.6) * 1.1, Math.sin(a) * 2.1);
      sat.current.rotation.y = -a;
    }
    if (planet.current) planet.current.rotation.y = t * 0.06;
  });

  return (
    <group position={ORIGIN}>
      <mesh ref={planet}>
        <sphereGeometry args={[1.7, 24, 18]} />
        <meshBasicMaterial color="#1A4653" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
        <ringGeometry args={[4.0, 4.05, 64]} />
        <meshBasicMaterial color={TEAL_SOFT} transparent opacity={0.26} side={DoubleSide} />
      </mesh>
      <group ref={sat} scale={0.42}>
        <mesh>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
          <meshStandardMaterial color={ICE} roughness={0.4} metalness={0.6} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.1, 0, 0]}>
            <boxGeometry args={[1.3, 0.04, 0.62]} />
            <meshStandardMaterial color={TEAL_SOFT} roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color={ORANGE} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Girişimcilik — fikirden prototipe yükselen basamaklar
 * ------------------------------------------------------------------ */

const STEPS = 6;

function GrowthFx() {
  const bars = useRef<Mesh[]>([]);
  const spark = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = (t % 10) / 10;

    bars.current.forEach((m, i) => {
      if (!m) return;
      const h = 0.4 + ((i + 1) / STEPS) * 3.2;
      const grow = Math.min(1, Math.max(0, (cycle - i * 0.11) * 4));
      m.scale.y = 0.001 + grow * h;
      m.position.y = -1.7 + (grow * h) / 2;
    });

    if (spark.current) {
      const i = Math.min(STEPS - 1, Math.floor(cycle * STEPS * 1.15));
      const h = 0.4 + ((i + 1) / STEPS) * 3.2;
      spark.current.position.set((i - (STEPS - 1) / 2) * 1.25, -1.7 + h + 0.4, 0);
      (spark.current.material as { opacity: number }).opacity = 0.5 + Math.sin(t * 6) * 0.28;
    }
  });

  return (
    <group position={ORIGIN}>
      {Array.from({ length: STEPS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) bars.current[i] = el;
          }}
          position={[(i - (STEPS - 1) / 2) * 1.25, -1.7, 0]}
        >
          <boxGeometry args={[0.6, 1, 0.6]} />
          <meshStandardMaterial
            color={i === STEPS - 1 ? ORANGE : TEAL_SOFT}
            roughness={0.55}
            metalness={0.35}
          />
        </mesh>
      ))}
      <mesh ref={spark}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Seçici
 * ------------------------------------------------------------------ */

const FX = {
  rocket: RocketFx,
  drone: DroneFx,
  neural: NeuralFx,
  robot: RobotFx,
  print: PrintFx,
  code: CodeFx,
  circuit: CircuitFx,
  shield: ShieldFx,
  orbit: OrbitFx,
  growth: GrowthFx,
} as const;

export function CategoryFx() {
  const holder = useRef<Group>(null);
  const [kind, setKind] = useState<string | null>(null);
  const shown = useRef<string | null>(null);

  useFrame(() => {
    // Kategori değişimi saniyede bir kereden seyrek olur; tek state
    // güncellemesi burada ucuzdur ve sahnenin geri kalanını etkilemez.
    if (worldClock.fx !== shown.current) {
      shown.current = worldClock.fx;
      setKind(worldClock.fx);
    }

    if (!holder.current) return;

    // Açılışta yumuşak rampa — efekt sahneye sıçrayarak girmez.
    const k = Math.min(1, Math.max(0, (performance.now() - worldClock.fxSince) / 700));
    holder.current.scale.setScalar(0.72 + k * 0.28);
    holder.current.rotation.y = (1 - k) * 0.45;

    // Yalnızca eğitimler durağı civarında görünür; sayfanın geri
    // kalanında sahne kendi anlatısına döner.
    const near = worldClock.progress > 0.12 && worldClock.progress < 0.58;
    holder.current.visible = Boolean(shown.current) && near;
  });

  const Fx = kind && kind in FX ? FX[kind as keyof typeof FX] : null;

  return <group ref={holder}>{Fx ? <Fx /> : null}</group>;
}
