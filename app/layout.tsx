import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pilah Pintar — Belajar Pilah Sampah",
    template: "%s | Pilah Pintar",
  },
  description:
    "Micro-learning singkat untuk siswa SMA: mengenali jenis sampah, membersihkan kemasan, membuat karya daur ulang, dan merawatnya.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4faf3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1610" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="flex min-h-dvh flex-col">
        <a href="#konten" className="skip-link">
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main id="konten" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
