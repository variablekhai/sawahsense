import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["leaflet", "react-leaflet"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.arcgisonline.com",
      },
      {
        protocol: "https",
        hostname: "**.openstreetmap.org",
      },
    ],
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    return [
      { source: "/api/gee-indices", destination: `${backend}/api/gee-indices` },
      { source: "/api/pak-tani", destination: `${backend}/api/pak-tani` },
      {
        source: "/api/send-whatsapp",
        destination: `${backend}/api/send-whatsapp`,
      },
    ];
  },
};

export default nextConfig;
