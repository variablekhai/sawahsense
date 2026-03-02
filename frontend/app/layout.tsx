import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SawahSense — Pemantauan Padi Pintar",
  description:
    "Sistem pemantauan tanaman padi berkuasa satelit untuk petani Malaysia. Pantau NDVI, EVI, LSWI dan dapatkan nasihat daripada Pak Tani AI.",
  keywords: [
    "padi",
    "NDVI",
    "GEE",
    "Google Earth Engine",
    "pertanian",
    "Malaysia",
    "MADA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
