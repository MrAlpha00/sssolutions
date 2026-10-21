import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Brand treatment.
 *
 * The logo is rendered from the transparent PNG lockups in `public/brand`:
 * - `logo.png`       — dark lockup (Cyprus mark + Cyprus wordmark) for light
 *                      backgrounds such as the header.
 * - `logo-light.png` — inverted lockup (sand mark + sand wordmark) for the
 *                      dark Cyprus footer.
 * - `icon.png`       — square mark only, used for compact placements and as
 *                      the app-router icon / favicon.
 *
 * The intrinsic sizes are always declared so the browser can reserve the right
 * space and the artwork is never stretched or upscaled. To swap in the
 * client's own artwork, replace the files in `public/brand` (keeping the same
 * aspect ratio) or update the constants below.
 */

const LOCKUP = { width: 847, height: 240 } as const;
const MARK = { width: 512, height: 512 } as const;

const brandAssets = {
  dark: "/brand/logo.png",
  light: "/brand/logo-light.png",
} as const;

export function BrandLogo({
  tone = "dark",
  className,
  compact = false,
  href,
  preload = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  /** Render the square mark only (no horizontal wordmark). */
  compact?: boolean;
  /** When set the logo becomes a link to this address. */
  href?: string;
  /** Load the logo eagerly (above-the-fold placements such as the header). */
  preload?: boolean;
}) {
  const content = compact ? (
    <Image
      src="/brand/icon.png"
      alt="Supportive HR Solutions"
      width={MARK.width}
      height={MARK.height}
      sizes="48px"
      className="h-10 w-10 object-contain"
      preload={preload}
    />
  ) : (
    <Image
      src={brandAssets[tone]}
      alt="Supportive HR Solutions"
      width={LOCKUP.width}
      height={LOCKUP.height}
      sizes="(min-width: 640px) 141px, 127px"
      className="h-9 w-auto object-contain sm:h-10"
      preload={preload}
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      aria-label="Supportive HR Solutions — home"
      className={cn("inline-flex items-center rounded-lg", className)}
    >
      {content}
    </Link>
  );
}
