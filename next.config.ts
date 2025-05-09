import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {

    ignoreBuildErrors: true,
  },
  experimental: {
  
    optimizePackageImports: ["framer-motion"],
    swcPlugins: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {

    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;