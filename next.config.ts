import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion"],
    swcPlugins: [],
  },


  // Improve image optimization
  images: {
    // Optimize images more aggressively
    minimumCacheTTL: 60,
    formats: ["image/webp","image/avif"],
  },
};

export default nextConfig;
