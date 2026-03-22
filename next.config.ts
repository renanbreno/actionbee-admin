import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  async rewrites() {
    return [
      // admin.actionbee.com.br → /dashboard/*
      {
        source: "/((?!dashboard|_next|api|favicon\\.ico|icon\\.png|apple-icon\\.png|sitemap\\.xml|robots\\.txt).*)",
        has: [{ type: "host", value: "admin\\.actionbee\\.com\\.br" }],
        destination: "/dashboard/$1",
      },
      // afiliados.actionbee.com.br → /affiliate/*
      {
        source: "/((?!affiliate|_next|api|favicon\\.ico|icon\\.png|apple-icon\\.png|sitemap\\.xml|robots\\.txt).*)",
        has: [{ type: "host", value: "afiliados\\.actionbee\\.com\\.br" }],
        destination: "/affiliate/$1",
      },
    ];
  },
};

export default nextConfig;
