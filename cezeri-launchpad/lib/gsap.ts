"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Tek kayıt noktası. Her yerden `import { gsap, ScrollTrigger } from "@/lib/gsap"`.
 * Çift kayıt ScrollTrigger'da sessiz hatalara yol açar.
 */
if (typeof window !== "undefined") {
  // registerPlugin aynı eklenti için idempotenttir; çift çağrı zararsızdır.
  gsap.registerPlugin(ScrollTrigger);
}

export const EASE = {
  launch: "power4.out",
  thrust: "power2.inOut",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
