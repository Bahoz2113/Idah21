"use client";

/**
 * CZR CEOS — kurumsal baykuş logosu (gerçek marka görseli).
 * CEZERİ ROBOTECH robotik baykuşu. Boyut `size` (px) ile ölçeklenir.
 * Şeffaf PNG olduğundan hem koyu hem açık zeminde çalışır.
 */
export function OwlMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="CZR CEOS"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}

/** Yatay kilit — marka işareti + "CZR CEOS" adı. Header ve login için. */
export function BrandLockup({
  size = 30,
  markColor = "",
  czrColor = "text-white",
  ceosColor = "text-vurgu",
  className = "",
}: {
  size?: number;
  markColor?: string;
  czrColor?: string;
  ceosColor?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <OwlMark size={size} className={markColor} />
      <span className="font-extrabold tracking-tight leading-none">
        <span className={czrColor}>CZR</span>{" "}
        <span className={ceosColor}>CEOS</span>
      </span>
    </div>
  );
}
