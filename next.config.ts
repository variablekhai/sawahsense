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
};

export default nextConfig;
