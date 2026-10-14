import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

/**
 * Dynamic Open Graph image, generated at build time.
 *
 * It uses only brand colours and typography (no external assets or fonts), so
 * it works offline and never depends on a third-party image host. Replace it
 * with a designed brand image (`public/og-image.png`) if the client supplies one.
 *
 * Note: this is rendered by Satori, which requires every element with more than
 * one child to declare `display: "flex"` explicitly.
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#004741",
          padding: "72px 80px",
          color: "#F0EDE4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#0b5f57",
              color: "#8FC79A",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600 }}>
            {siteConfig.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#9FD3A8",
            }}
          >
            {siteConfig.tagline}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 64,
              lineHeight: 1.15,
              fontWeight: 600,
            }}
          >
            <div style={{ display: "flex" }}>Building stronger teams.</div>
            <div style={{ display: "flex" }}>Creating better workplaces.</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(240,237,228,0.78)",
            }}
          >
            HR services · Bengaluru, Karnataka
          </div>
        </div>
      </div>
    ),
    size,
  );
}
