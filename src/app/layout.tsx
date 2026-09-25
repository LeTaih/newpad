import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const title = `${site.name} — ${site.tagline}`;

const ogImage = { url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: title };

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description: site.description,
  openGraph: { title, description: site.description, siteName: site.name, type: "website", images: [ogImage] },
  twitter: { card: "summary_large_image", title, description: site.description, images: [ogImage.url] },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-48 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent/12 blur-[140px]" />
          <div className="absolute top-1/3 -left-48 h-[32rem] w-[32rem] rounded-full bg-[#3b5bff]/12 blur-[140px]" />
          <div className="absolute -right-48 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[#9b5cff]/10 blur-[140px]" />
        </div>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
