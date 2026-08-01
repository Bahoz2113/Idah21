import Image from "next/image";
import { MEDIA, hasMedia } from "@/lib/media";
import { AutoVideo } from "./AutoVideo";

/**
 * MEDYA SLOT'U
 *
 * Medya (Gemini Omni videoları / Nano Banana görselleri) henüz gelmediyse
 * prosedürel bir yer tutucu gösterir — kırık görsel ikonu değil, kasıtlı
 * bir teknik desen. Medya `lib/media.ts`'e eklendiği anda otomatik devreye girer.
 *
 * `alt` metni her zaman olgusal ve tarifseldir: hem erişilebilirlik hem GEO.
 */
export function MediaSlot({
  slot,
  label,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  slot: string;
  label: string;
  className?: string;
  priority?: boolean;
  /** Responsive srcset ipucu — yanlış değer gereksiz büyük dosya indirtir. */
  sizes?: string;
}) {
  const asset = MEDIA[slot];

  if (hasMedia(slot) && asset) {
    if (asset.kind === "video") {
      return <AutoVideo asset={asset} label={label} className={`object-cover ${className}`} />;
    }
    return (
      <Image
        src={asset.src}
        alt={label}
        width={asset.width}
        height={asset.height}
        priority={priority}
        placeholder="blur"
        blurDataURL={asset.blur}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden bg-void ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(26,35,126,.55) 0 2px, transparent 2px 9px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 100%, rgba(255,111,0,.14), transparent 60%)",
        }}
      />
      <span className="t-mono absolute bottom-3 left-3 text-ash/70">
        {slot}
      </span>
    </div>
  );
}
