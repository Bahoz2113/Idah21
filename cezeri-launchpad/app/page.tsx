import { SceneMount } from "@/components/three/SceneMount";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ProgressRail } from "@/components/hud/ProgressRail";
import { S00Preloader } from "@/components/scenes/S00Preloader";
import { S01Launchpad } from "@/components/scenes/S01Launchpad";
import { S02Exploded } from "@/components/scenes/S02Exploded";
import { S03Hangar } from "@/components/scenes/S03Hangar";
import { S04FirstLaunch } from "@/components/scenes/S04FirstLaunch";
import { S05Prototypes } from "@/components/scenes/S05Prototypes";
import { S06Methodology } from "@/components/scenes/S06Methodology";
import { S07Clearance } from "@/components/scenes/S07Clearance";
import { S08Tower } from "@/components/scenes/S08Tower";

/**
 * TEK SAYFA DENEYİM
 *
 * Bu bir Server Component'tir ve öyle kalmalıdır. Sahnelerin metni sunucuda
 * render edilir; yalnızca animasyon ve WebGL istemci sınırlarının arkasındadır
 * (GEO kuralı K1). Doğrulama:
 *   curl -A "GPTBot" <url> | grep "Batman'ın ilk VTOL İHA"
 */
export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <ProgressRail />
      <S00Preloader />

      {/* Paylaşılan WebGL katmanı — S01, S02 ve S04 boyunca sabit durur */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <SceneMount />
      </div>

      <main id="icerik" className="relative z-10">
        <S01Launchpad />
        <S02Exploded />
        <S03Hangar />
        <S04FirstLaunch />
        <S05Prototypes />
        <S06Methodology />
        <S07Clearance />
        <S08Tower />
      </main>
    </>
  );
}
