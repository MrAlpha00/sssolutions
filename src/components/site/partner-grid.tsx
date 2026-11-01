"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Clients / partners logo gallery.
 *
 * Real logo PNGs live in `public/brand_logos/` and are matched to the partner
 * records by company name. A partner set with a `logo_url` in the admin
 * dashboard keeps using that image. If the file cannot be loaded, the
 * company's initials stand in as a restrained placeholder — never a broken
 * image icon. The company name always stays visible.
 *
 * Desktop: two slow, opposite-direction marquee rows (paused on hover/focus).
 * Reduced-motion: a simple, accessible grid.
 */

/**
 * Local logo assets. Each entry matches on a normalised fragment of the
 * company name so names with suffixes such as "Pvt. Ltd." still resolve.
 */
const PARTNER_LOGOS: ReadonlyArray<{ match: string; src: string }> = [
  { match: "wmer", src: "/brand_logos/01-wmer-minerals.png" },
  { match: "jodidar", src: "/brand_logos/02-jodidar-accretions.png" },
  { match: "bigbasket", src: "/brand_logos/03-bigbasket.png" },
  { match: "texport", src: "/brand_logos/04-texport-industries.png" },
  { match: "hypermarket", src: "/brand_logos/05-hypermarket.png" },
  { match: "shashi", src: "/brand_logos/06-shashi-distilleries.png" },
  { match: "intelligentretail", src: "/brand_logos/07-intelligent-retail.png" },
  { match: "indwell", src: "/brand_logos/08-indwell-retail.png" },
  { match: "ipintegrated", src: "/brand_logos/09-ip-integrated-services.png" },
  { match: "metrocash", src: "/brand_logos/10-metro-cash-and-carry.png" },
  { match: "adishwar", src: "/brand_logos/11-adishwar-delivery.png" },
  { match: "redhood", src: "/brand_logos/12-redhood-logistics.png" },
  { match: "freshzone", src: "/brand_logos/13-fresh-zone-farms.png" },
  { match: "speedlink", src: "/brand_logos/14-speedlink-service.png" },
  { match: "cnrchemicals", src: "/brand_logos/15-cnr-chemicals.png" },
  { match: "himalaya", src: "/brand_logos/16-himalaya.png" },
];

function localLogoFor(name: string): string | null {
  const normalised = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    PARTNER_LOGOS.find((logo) => normalised.includes(logo.match))?.src ?? null
  );
}

// Words that don't help identify a company when building its initials.
const NAME_NOISE = new Set([
  "pvt",
  "private",
  "ltd",
  "limited",
  "and",
  "the",
  "co",
  "company",
]);

function partnerInitials(name: string): string {
  const words = name
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .filter((word) => word.length > 0 && !NAME_NOISE.has(word.toLowerCase()));

  if (words.length === 0) {
    return name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  }

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

export function PartnerGrid({ partners }: { partners: Partner[] }) {
  const reduce = useReducedMotion();
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  const [rowA, rowB] = useMemo(() => {
    const middle = Math.ceil(partners.length / 2);
    return [partners.slice(0, middle), partners.slice(middle)];
  }, [partners]);

  if (partners.length === 0) return null;

  /**
   * Shared tile content: the real logo when one resolves, otherwise an
   * initials badge, plus the company name so every entry stays readable.
   */
  const tileContent = (partner: Partner) => {
    const logoSrc = partner.logo_url ?? localLogoFor(partner.name);
    const showLogo = Boolean(logoSrc) && !failedLogos[partner.id];

    return (
      <>
        <span className="flex h-16 w-full items-center justify-center">
          {showLogo && logoSrc ? (
            <span className="relative block h-full w-full">
              <Image
                src={logoSrc}
                alt={`${partner.name} logo`}
                fill
                sizes="(min-width: 640px) 224px, 200px"
                className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                onError={() =>
                  setFailedLogos((previous) => ({
                    ...previous,
                    [partner.id]: true,
                  }))
                }
              />
            </span>
          ) : (
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-cyprus/8 font-heading text-xs font-semibold tracking-wide text-cyprus transition-colors group-hover:bg-cyprus/15"
            >
              {partnerInitials(partner.name)}
            </span>
          )}
        </span>
        <span className="line-clamp-2 text-[0.72rem] font-medium leading-snug text-cyprus/85 transition-colors group-hover:text-cyprus">
          {partner.name}
        </span>
      </>
    );
  };

  const tile = (partner: Partner, duplicated = false) => (
    <li
      key={`${partner.id}-${duplicated ? "copy" : "original"}`}
      aria-hidden={duplicated || undefined}
      title={partner.name}
      className="group mx-3 flex h-[7.75rem] w-64 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl bg-cream/70 px-4 py-2.5 text-center transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.04] hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(0,51,46,0.45)] focus-within:z-10 focus-within:-translate-y-1 focus-within:scale-[1.04] focus-within:bg-white"
    >
      {tileContent(partner)}
    </li>
  );

  const marqueeRow = (items: Partner[], direction: "left" | "right") => (
    <div className="flex w-max marquee-row" data-direction={direction}>
      <ul className="flex items-center">
        {items.map((partner) => tile(partner))}
      </ul>
      {/* Duplicate for a seamless loop; hidden from assistive tech. */}
      <ul className="flex items-center" aria-hidden="true">
        {items.map((partner) => tile(partner, true))}
      </ul>
    </div>
  );

  // Static, accessible grid when animating would be awkward.
  if (reduce) {
    return (
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {partners.map((partner) => (
          <li
            key={partner.id}
            title={partner.name}
            className={cn(
              "group flex min-h-[7.75rem] flex-col items-center justify-center gap-1.5 rounded-2xl bg-cream/70 px-4 py-3 text-center transition-colors",
              "hover:bg-white",
            )}
          >
            {tileContent(partner)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "relative -mx-5 overflow-hidden py-5 sm:-mx-6 lg:-mx-8",
        // Soft edge fades so the tracks blend into the section background.
        "before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-16 before:bg-gradient-to-r before:from-cream before:to-transparent sm:before:w-24",
        "after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-16 after:bg-gradient-to-l after:from-cream after:to-transparent sm:after:w-24",
      )}
    >
      <div className="flex flex-col gap-4">
        {marqueeRow(rowA, "left")}
        {rowB.length > 0 ? marqueeRow(rowB, "right") : null}
      </div>
    </div>
  );
}
