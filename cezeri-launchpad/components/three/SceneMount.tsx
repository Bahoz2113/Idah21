"use client";

import dynamic from "next/dynamic";

/**
 * WebGL sınır bileşeni.
 *
 * `ssr: false` App Router'da Server Component içinde kullanılamaz; bu yüzden
 * mount işi bu ince istemci sarmalayıcısına devredilir. Sayfanın kendisi
 * Server Component olarak kalır ve tüm metin sunucuda render edilir (GEO kuralı K1).
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export function SceneMount() {
  return <SceneCanvas />;
}
