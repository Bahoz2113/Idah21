import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js ESM kaynaklarını transpile et (R3F ekosistemi ESM-only paketler içerir)
  transpilePackages: ["three"],
};

export default nextConfig;
