import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure stable builds
  productionBrowserSourceMaps: false,
  // Disable powered by header
  poweredByHeader: false,
};

export default nextConfig;
