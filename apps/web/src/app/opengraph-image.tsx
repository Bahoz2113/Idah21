import { ImageResponse } from "next/og";
import { contact, org } from "@/lib/seo/site";

/**
 * Dinamik OG görseli (1200×630).
 * Dış font veya görsel çekmez — CSP ve build-time ağ bağımlılığı yok.
 */
export const runtime = "edge";
export const alt = `${org.name} — ${org.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #0A191D 0%, #0F4C5C 55%, #0D5C63 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Üst şerit — kurumsal kimlik satırı */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#FF8C00",
              boxShadow: "0 0 24px #FF8C00",
            }}
          />
          <div
            style={{
              color: "#F2F8F8",
              fontSize: 26,
              letterSpacing: 8,
              fontWeight: 700,
            }}
          >
            {org.name}
          </div>
        </div>

        {/* Ana manşet */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 82,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            {org.slogan}
          </div>
          <div style={{ color: "#FF8C00", fontSize: 32, fontWeight: 600 }}>
            {org.tagline}
          </div>
        </div>

        {/* Alt bilgi şeridi */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            color: "#9FC4CC",
            fontSize: 24,
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
          }}
        >
          <span>{contact.address.city}</span>
          <span style={{ color: "#10B981" }}>•</span>
          <span>{org.ageRange.label}</span>
          <span style={{ color: "#10B981" }}>•</span>
          <span>Robotik · Yapay Zeka · İHA · Roket</span>
        </div>
      </div>
    ),
    size,
  );
}
