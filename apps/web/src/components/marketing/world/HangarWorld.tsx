"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  type Group,
  type Mesh,
  type Points,
  Vector3,
} from "three";
import { worldClock } from "./progress";

/**
 * GECE HANGARI — sayfanın tamamının içinde geçtiği tek sürekli dünya.
 *
 * Bu dosya YALNIZCA `WorldStage` tarafından, ilk boyamadan sonra ve yeterli
 * kapasitedeki cihazlarda dinamik yüklenir. Hiçbir yerden statik import
 * edilmemelidir; aksi hâlde three.js ilk yük bütçesine girer.
 *
 * Sahne dekoratiftir: tüm metin, bağlantı ve yapılandırılmış veri DOM'da,
 * bu katmanın üstünde yaşar. Sahne hiç yüklenmese de sayfa eksiksizdir.
 *
 * `drei` bilinçli olarak kullanılmadı — ihtiyaç duyulan her şey çekirdek
 * three ile karşılanıyor ve ~150 kB bundle'dan uzak kalıyor.
 */

const TEAL_DEEP = "#0A191D";
const TEAL = "#0F4C5C";
const TEAL_SOFT = "#1B6E7E";
const ORANGE = "#FF8C00";
const EMERALD = "#10B981";
const ICE = "#CFE3E6";

/* ------------------------------------------------------------------ *
 * Kamera yolu
 *
 * Yürüyüş hangarın içinde başlar, koridordan geçer, kapıdan fırlatma
 * sahasına çıkar, sisteki dişli katmanına döner ve konsolda yükselerek
 * biter. Anahtar kareler arası smoothstep ile yumuşatılır; ayrıca her
 * karede `damp` uygulanır ki scroll jank'i kameraya taşınmasın.
 * ------------------------------------------------------------------ */

type Keyframe = { at: number; pos: [number, number, number]; look: [number, number, number] };

const PATH: Keyframe[] = [
  { at: 0.0, pos: [0, 1.7, 15.5], look: [0, 1.6, 0] },   // 00 eşik: kapılar kapalı
  { at: 0.13, pos: [0, 1.9, 11.0], look: [0, 1.7, -2] }, // 01 telemetri: ışık sızar
  { at: 0.34, pos: [0, 2.1, 3.5], look: [0, 1.9, -10] }, // 02 koridor: bölmeler
  { at: 0.53, pos: [0, 2.3, -5.5], look: [0, 2.0, -18] },// eşikten dışarı
  { at: 0.68, pos: [3.4, 3.1, -13.0], look: [-1.5, 2.4, -24] }, // 03 saha: rampa
  { at: 0.82, pos: [0.6, 2.4, -22.0], look: [0, 2.2, -32] },    // 04 sis: dişliler
  { at: 1.0, pos: [0, 4.2, -30.0], look: [0, 1.6, -40] },       // 06 konsol
];

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const tmpPos = new Vector3();
const tmpLook = new Vector3();

function samplePath(p: number, outPos: Vector3, outLook: Vector3) {
  let i = 0;
  while (i < PATH.length - 2 && p > PATH[i + 1].at) i += 1;

  const a = PATH[i];
  const b = PATH[i + 1];
  const span = b.at - a.at || 1;
  const t = smoothstep(Math.min(1, Math.max(0, (p - a.at) / span)));

  outPos.set(
    a.pos[0] + (b.pos[0] - a.pos[0]) * t,
    a.pos[1] + (b.pos[1] - a.pos[1]) * t,
    a.pos[2] + (b.pos[2] - a.pos[2]) * t,
  );
  outLook.set(
    a.look[0] + (b.look[0] - a.look[0]) * t,
    a.look[1] + (b.look[1] - a.look[1]) * t,
    a.look[2] + (b.look[2] - a.look[2]) * t,
  );
}

/** Bir aralığın içindeki normalize konum; istasyon animasyonlarını sürer. */
const band = (p: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (p - from) / (to - from)));

/* ------------------------------------------------------------------ *
 * Wordmark
 *
 * Harfler 3D uzayda duran bir düzleme çizilir; ÖNÜNDEN hangar kirişleri ve
 * toz düzlemleri geçer. Occlusion sahte değil: derinlik testinin doğal
 * sonucu. Font yükleyici yerine canvas dokusu kullanmak hem ~200 kB
 * typeface indirmesini hem de FOUT'u ortadan kaldırır.
 * ------------------------------------------------------------------ */

function useWordmarkTexture(text: string) {
  return useMemo(() => {
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
    ctx.letterSpacing = "24px";

    // İçi boş, yalnızca kenarı yanan harfler — hangar zemininde ışık izi gibi.
    ctx.strokeStyle = "rgba(207, 227, 230, 0.92)";
    ctx.lineWidth = 6;
    ctx.strokeText(text, w / 2, h / 2 + 8);

    ctx.fillStyle = "rgba(207, 227, 230, 0.10)";
    ctx.fillText(text, w / 2, h / 2 + 8);

    const tex = new CanvasTexture(canvas);
    tex.anisotropy = 4;
    return tex;
  }, [text]);
}

function Wordmark() {
  const tex = useWordmarkTexture("CEZERÎ");
  const mesh = useRef<Mesh>(null);

  useFrame(() => {
    if (!mesh.current) return;
    // Eşikte tam görünür, koridorda geride kalır, sahada tamamen söner.
    const fade = 1 - band(worldClock.progress, 0.08, 0.42);
    const mat = mesh.current.material as { opacity: number };
    mat.opacity = 0.16 + fade * 0.74;
  });

  if (!tex) return null;

  return (
    <mesh ref={mesh} position={[0, 2.4, -6]} scale={[16, 4, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent opacity={0.9} depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Hangar kabuğu: zemin, yan duvarlar, tavan kirişleri, kapılar
 * ------------------------------------------------------------------ */

const TRUSS_COUNT = 14;

function HangarShell() {
  const doorLeft = useRef<Mesh>(null);
  const doorRight = useRef<Mesh>(null);

  useFrame(() => {
    // Kapılar 0.10 → 0.50 arasında açılır; yürüyüşün eşik anı budur.
    const open = smoothstep(band(worldClock.progress, 0.1, 0.5)) * 7.4;
    if (doorLeft.current) doorLeft.current.position.x = -3.7 - open;
    if (doorRight.current) doorRight.current.position.x = 3.7 + open;
  });

  const trusses = useMemo(
    () => Array.from({ length: TRUSS_COUNT }, (_, i) => 12 - i * 2.6),
    [],
  );

  return (
    <group>
      {/* Zemin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -14]}>
        <planeGeometry args={[46, 90]} />
        <meshStandardMaterial color={TEAL_DEEP} roughness={0.82} metalness={0.28} />
      </mesh>

      {/* Yan duvarlar — koridoru tanımlar */}
      {[-9.2, 9.2].map((x) => (
        <mesh key={x} position={[x, 4.2, 0]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[34, 8.4]} />
          <meshStandardMaterial color="#0C2229" roughness={0.95} metalness={0.1} />
        </mesh>
      ))}

      {/* Tavan kirişleri — wordmark'ın önünden geçen occluder'lar */}
      {trusses.map((z) => (
        <mesh key={z} position={[0, 6.6, z]}>
          <boxGeometry args={[18.8, 0.22, 0.34]} />
          <meshStandardMaterial color="#14343C" roughness={0.7} metalness={0.5} />
        </mesh>
      ))}

      {/* Hangar kapıları */}
      <mesh ref={doorLeft} position={[-3.7, 3.6, -16.2]}>
        <boxGeometry args={[7.3, 7.2, 0.4]} />
        <meshStandardMaterial color="#0E2A31" roughness={0.6} metalness={0.55} />
      </mesh>
      <mesh ref={doorRight} position={[3.7, 3.6, -16.2]}>
        <boxGeometry args={[7.3, 7.2, 0.4]} />
        <meshStandardMaterial color="#0E2A31" roughness={0.6} metalness={0.55} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * 10 disiplin: koridorun bölmeleri. Kamera yaklaştıkça sırayla yanar.
 * ------------------------------------------------------------------ */

const BAYS = Array.from({ length: 10 }, (_, i) => ({
  z: 7 - i * 2.3,
  side: i % 2 === 0 ? -1 : 1,
  index: i,
}));

function Bay({ z, side, index }: { z: number; side: number; index: number }) {
  const strip = useRef<Mesh>(null);

  useFrame(() => {
    if (!strip.current) return;
    // Bölmeler 0.18 → 0.52 aralığında birer birer aydınlanır.
    const own = 0.18 + (index / BAYS.length) * 0.3;
    const lit = smoothstep(band(worldClock.progress, own, own + 0.07));
    const mat = strip.current.material as { opacity: number };
    mat.opacity = 0.06 + lit * 0.86;
  });

  return (
    <mesh ref={strip} position={[side * 8.9, 2.5, z]} rotation={[0, side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      <planeGeometry args={[1.9, 0.09]} />
      <meshBasicMaterial color={index % 3 === 0 ? ORANGE : TEAL_SOFT} transparent opacity={0.1} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 * Hangardaki VTOL: yürüyüşün ilk durağında rotorlarını ısıtır.
 *
 * Bu daha önce hero'nun içinde ayrı bir WebGL bağlamında duruyordu; iki
 * sahne hem üst üste biniyor hem de GPU'yu iki kez ödetiyordu. Artık
 * dünyanın kendi nesnesi: kamera onu geçip koridora giriyor.
 * ------------------------------------------------------------------ */

const ARMS = [0.25, 0.75, 1.25, 1.75].map((a) => a * Math.PI);

function HangarDrone() {
  const body = useRef<Group>(null);
  const rotors = useRef<Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (body.current) {
      // Havada asılı duruş: yükseklikte küçük salınım, gövdede hafif yalpa.
      body.current.position.y = 2.9 + Math.sin(t * 0.9) * 0.06;
      body.current.rotation.z = Math.sin(t * 0.7) * 0.03;
      body.current.rotation.y = -0.35 + Math.sin(t * 0.35) * 0.05;
    }

    // Rotorlar sabit hızda; motorlar çalışıyor.
    for (const r of rotors.current) if (r) r.rotation.y = t * 16;
  });

  return (
    <group ref={body} position={[3.1, 2.9, 5.2]} scale={0.9}>
      {/* Gövde */}
      <mesh>
        <boxGeometry args={[1.15, 0.2, 0.72]} />
        <meshStandardMaterial color="#0E2F38" roughness={0.42} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.6, 0.14, 0.44]} />
        <meshStandardMaterial color={TEAL_SOFT} roughness={0.35} metalness={0.6} />
      </mesh>

      {/* Kollar, motorlar, rotorlar */}
      {ARMS.map((angle, i) => {
        const x = Math.cos(angle) * 0.92;
        const z = Math.sin(angle) * 0.92;
        return (
          <group key={angle} position={[x, 0, z]}>
            <mesh position={[-x / 2, 0, -z / 2]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.94, 0.07, 0.07]} />
              <meshStandardMaterial color="#123840" roughness={0.5} metalness={0.65} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.16, 12]} />
              <meshStandardMaterial color={ORANGE} roughness={0.3} metalness={0.55} />
            </mesh>
            <group
              ref={(el) => {
                if (el) rotors.current[i] = el;
              }}
              position={[0, 0.2, 0]}
            >
              <mesh>
                <boxGeometry args={[1.02, 0.012, 0.05]} />
                <meshBasicMaterial color={ICE} transparent opacity={0.34} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[1.02, 0.012, 0.05]} />
                <meshBasicMaterial color={ICE} transparent opacity={0.34} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Fırlatma sahası: rampa ve roket. Kapı açılınca görünür.
 * ------------------------------------------------------------------ */

function LaunchField() {
  const rocket = useRef<Group>(null);

  useFrame((state) => {
    if (!rocket.current) return;
    // Rampada hafif salınım: durağan bir prop değil, hazır bekleyen bir araç.
    rocket.current.rotation.z = -0.22 + Math.sin(state.clock.elapsedTime * 0.6) * 0.008;
  });

  return (
    <group position={[-2.2, 0, -26]}>
      {/* Rampa */}
      <mesh position={[0, 1.6, 0]} rotation={[0, 0, -0.22]}>
        <boxGeometry args={[0.36, 7.4, 0.36]} />
        <meshStandardMaterial color="#16383F" roughness={0.65} metalness={0.6} />
      </mesh>

      {/* Roket */}
      <group ref={rocket} position={[0.55, 2.6, 0]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 4.2, 18]} />
          <meshStandardMaterial color={ICE} roughness={0.4} metalness={0.35} />
        </mesh>
        <mesh position={[0, 2.5, 0]}>
          <coneGeometry args={[0.26, 0.9, 18]} />
          <meshStandardMaterial color={ORANGE} roughness={0.35} metalness={0.4} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, -1.9, 0]} rotation={[0, (i / 3) * Math.PI * 2, 0]}>
            <boxGeometry args={[0.06, 0.8, 0.5]} />
            <meshStandardMaterial color={TEAL_SOFT} roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Ufuk çizgisi — sahanın sonu */}
      <mesh position={[2.2, 0.02, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#081418" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Cezerî katmanı: sisin içinde dönen pirinç dişliler.
 * ------------------------------------------------------------------ */

function LegacyGears() {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.rotation.z = t * (i % 2 === 0 ? 0.22 : -0.3);
    });
    // Yalnızca miras durağında belirir.
    const show = smoothstep(band(worldClock.progress, 0.7, 0.86));
    group.current.scale.setScalar(0.6 + show * 0.6);
  });

  return (
    <group ref={group} position={[2.6, 3.0, -34]}>
      {[
        { r: 1.5, x: 0, y: 0, teeth: 16 },
        { r: 0.95, x: 2.1, y: -0.9, teeth: 12 },
        { r: 0.6, x: -1.7, y: 1.2, teeth: 10 },
      ].map((g, i) => (
        <group key={i} position={[g.x, g.y, 0]}>
          <mesh>
            <torusGeometry args={[g.r, g.r * 0.11, 8, 34]} />
            <meshStandardMaterial color="#B07A3A" roughness={0.42} metalness={0.85} />
          </mesh>
          {Array.from({ length: g.teeth }, (_, k) => (
            <mesh key={k} rotation={[0, 0, (k / g.teeth) * Math.PI * 2]}>
              <boxGeometry args={[g.r * 0.16, g.r * 2.28, g.r * 0.14]} />
              <meshStandardMaterial color="#8E5F2B" roughness={0.5} metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Atmosfer: hangar ışığındaki toz, sahada kıvılcım.
 * ------------------------------------------------------------------ */

const MOTE_COUNT = 700;

function Motes() {
  const points = useRef<Points>(null);

  const geometry = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(MOTE_COUNT * 3);
    const seed = new Float32Array(MOTE_COUNT);

    for (let i = 0; i < MOTE_COUNT; i += 1) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 8.5;
      pos[i * 3 + 2] = 14 - Math.random() * 52;
      seed[i] = Math.random();
    }

    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.elapsedTime;
    const attr = geometry.getAttribute("position") as BufferAttribute;
    const seeds = geometry.getAttribute("aSeed") as BufferAttribute;

    // Toz yavaşça yükselir; scroll hızı onu geriye doğru sürükler.
    const drag = worldClock.velocity * 90;

    for (let i = 0; i < MOTE_COUNT; i += 1) {
      const s = seeds.getX(i);
      let y = attr.getY(i) + 0.0016 + s * 0.0022;
      if (y > 8.6) y = 0.05;
      attr.setY(i, y);
      attr.setX(i, attr.getX(i) + Math.sin(t * 0.25 + s * 12) * 0.0016);
      attr.setZ(i, attr.getZ(i) + drag * (0.4 + s * 0.6));
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color={ICE}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ *
 * Kamera sürücüsü
 * ------------------------------------------------------------------ */

function CameraRig() {
  const { camera } = useThree();
  const current = useRef(new Vector3(...PATH[0].pos));
  const target = useRef(new Vector3(...PATH[0].look));

  useFrame((_, delta) => {
    samplePath(worldClock.progress, tmpPos, tmpLook);

    // Dar ekranlarda kadraj geri çekilir; koridor mobilde de sığsın.
    if (worldClock.viewportWidth < 900) {
      tmpPos.z += 3.4;
      tmpPos.y += 0.3;
    }

    // Kare bağımsız yumuşatma: scroll'un tırtıklı adımları kameraya geçmez.
    const k = 1 - Math.pow(0.0016, delta);
    current.current.lerp(tmpPos, k);
    target.current.lerp(tmpLook, k);

    camera.position.copy(current.current);
    camera.lookAt(target.current);
  });

  return null;
}

/* ------------------------------------------------------------------ *
 * Sahne
 * ------------------------------------------------------------------ */

function Scene({ lite }: { lite: boolean }) {
  const key = useRef(new Color(ORANGE));

  return (
    <>
      {/* Sis koridora derinlik verir; fazlası mesafeyi tamamen yutuyordu. */}
      <fogExp2 attach="fog" args={[TEAL_DEEP, lite ? 0.032 : 0.024]} />
      <color attach="background" args={[TEAL_DEEP]} />

      {/* Hangar aydınlatması: soğuk tepe ışığı + turuncu çalışma fenerleri.
          Koridor boyunca ritmik fenerler olmadan orta bölüm kapkaranlıktı. */}
      <ambientLight intensity={0.5} color={TEAL} />
      <directionalLight position={[6, 12, 8]} intensity={0.95} color={ICE} />
      <pointLight position={[0, 5.4, 8]} intensity={34} distance={26} color={key.current} />
      <pointLight position={[0, 5.4, -2]} intensity={30} distance={24} color={key.current} />
      <pointLight position={[0, 5.0, -11]} intensity={26} distance={22} color={ICE} />
      <pointLight position={[0, 4.2, -24]} intensity={34} distance={38} color={EMERALD} />
      <pointLight position={[2.6, 3.4, -34]} intensity={22} distance={20} color={ORANGE} />

      <HangarShell />
      <Wordmark />
      <HangarDrone />
      {BAYS.map((b) => (
        <Bay key={b.z} {...b} />
      ))}
      <LaunchField />
      <LegacyGears />
      {lite ? null : <Motes />}

      <CameraRig />
    </>
  );
}

export default function HangarWorld({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas
      // Sahne dekoratiftir; tıklamalar altındaki içeriğe geçmelidir.
      style={{ pointerEvents: "none" }}
      camera={{ position: PATH[0].pos, fov: lite ? 54 : 46, near: 0.1, far: 120 }}
      dpr={lite ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: !lite, powerPreference: "high-performance" }}
    >
      <Scene lite={lite} />
    </Canvas>
  );
}
