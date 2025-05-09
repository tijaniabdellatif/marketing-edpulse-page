import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Optimize CSS - reduces CSS bundle size
    optimizeCss: true,

    // Optimize specific large packages
    optimizePackageImports: ["framer-motion"],


    // Enable modern JS optimizations
    swcPlugins: [],
  },
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },
  

  // Improve image optimization
  images: {
    // Optimize images more aggressively
    minimumCacheTTL: 60,
    formats: ["image/webp","image/avif"],
  },

  // Optimize for production
  productionBrowserSourceMaps: false,
};

export default nextConfig;
