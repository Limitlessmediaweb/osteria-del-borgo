import type { NextConfig } from "next";

const longCache = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: longCache }] },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
