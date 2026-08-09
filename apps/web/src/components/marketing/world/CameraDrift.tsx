"use client";

import { useFrame } from "@react-three/fiber";
import { worldClock } from "./progress";

/**
 * SCROLL'LA YÜRÜYEN KAMERA.
 *
 * Boyalı katmanlar CSS ile kayıyor, WebGL sahnesi ise sabit bir
 * kameradan bakıyordu. İkisi aynı dünyada olduğu hâlde farklı
 * kurallara uyuyordu: resimler ilerlerken toz, köz ve kategori
 * efektleri yerinde sayıyor, katmanların arasındaki bağ kopuyordu.
 *
 * Kamera artık aynı saatten besleniyor. Sayfa boyunca hafifçe
 * yükselir, öne doğru süzülür ve merkeze döner — WebGL katmanı
 * resimlerin arasına gerçekten oturur.
 *
 * Hareket bilerek küçük. Kadraj sertçe değişseydi kategori efektleri
 * (roket, sürü, sinir ağı) her scroll'da yeniden çerçevelenir, metnin
 * arkasındaki denge bozulurdu. Amaç sahneyi gezdirmek değil, katmanları
 * aynı dünyada tutmak.
 *
 * Değer her karede saatten okunur ve HEDEFE yaklaştırılır (lerp);
 * doğrudan atansaydı kaydırma duraklarında kamera zıplardı.
 */

/** Yumuşatma katsayısı: 1'e ne kadar yakınsa o kadar çabuk yakalar. */
const EASE = 0.055;

export function CameraDrift({ lite = false }: { lite?: boolean }) {
  // Dar ekranda kadraj zaten sıkışık; hareket payı yarıya iner.
  const gain = lite ? 0.5 : 1;

  useFrame((state) => {
    const p = worldClock.progress;

    const targetY = 2.4 + p * 1.9 * gain;
    const targetZ = 9 - p * 2.6 * gain;
    const targetX = Math.sin(p * Math.PI) * 0.85 * gain;

    const cam = state.camera;
    cam.position.x += (targetX - cam.position.x) * EASE;
    cam.position.y += (targetY - cam.position.y) * EASE;
    cam.position.z += (targetZ - cam.position.z) * EASE;

    // Bakış noktası da yükselir: kamera yükselirken aynı noktaya
    // bakmaya devam etseydi sahne aşağı kayıp boşalırdı.
    cam.lookAt(0, 1.8 + p * 1.4 * gain, -2);
  });

  return null;
}
