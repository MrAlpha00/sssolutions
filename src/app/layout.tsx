import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import type { ReactNode } from "react";

import {
  localBusinessJsonLd,
  organizationJsonLd,
  rootMetadata,
} from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

export const viewport: Viewport = {
  themeColor: "#004741",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      {/*
        `overflow-x-clip` keeps the page from scrolling sideways. Scroll-reveal
        animations start offset by 28px, so elements that have not yet been
        scrolled into view would otherwise widen the document. `clip` is used
        rather than `hidden` because it does not create a scroll container, so
        the sticky header keeps working.
      */}
      <body className="flex min-h-dvh flex-col overflow-x-clip bg-sand font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cyprus focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-sand"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Structured data is generated from trusted server-side config.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
