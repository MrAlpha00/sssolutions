"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Clients / partners logo gallery.
 *
 * No partner logos are invented. When a `logo_url` has been set in the admin
 * dashboard it is displayed (CSS background so any host works without extra
 * image configuration); otherwise the company's initials stand in as a
 * restrained placeholder. The company name always stays visible.
 *
 * Desktop: two slow, opposite-direction marquee rows (paused on hover/focus).
 * Reduced-motion: a simple, accessible grid.
 */

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

  const [rowA, rowB] = useMemo(() => {
    const middle = Math.ceil(partners.length / 2);
    return [partners.slice(0, middle), partners.slice(middle)];
  }, [partners]);

  if (partners.length === 0) return null;

  /**
   * Shared tile content: the logo when one exists, otherwise an initials badge,
   * plus the company name so every entry stays readable.
   */
  const tileContent = (partner: Partner) => (
    <>
      {partner.logo_url ? (
        <span
          role="img"
          aria-label={`${partner.name} logo`}
          className="h-9 w-full bg-contain bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${partner.logo_url})` }}
        />
      ) : (
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyprus/8 font-heading text-xs font-semibold tracking-wide text-cyprus transition-colors group-hover:bg-cyprus/15"
        >
          {partnerInitials(partner.name)}
        </span>
      )}
      <span className="line-clamp-2 text-[0.72rem] font-medium leading-snug text-cyprus/85 transition-colors group-hover:text-cyprus">
        {partner.name}
      </span>
    </>
  );

  const tile = (partner: Partner, duplicated = false) => (
    <li
      key={`${partner.id}-${duplicated ? "copy" : "original"}`}
      aria-hidden={duplicated || undefined}
      title={partner.name}
      className="group mx-3 flex h-[5.75rem] w-56 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-cream/80 px-4 text-center transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.05] hover:border-cyprus/25 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(0,51,46,0.45)] focus-within:z-10 focus-within:-translate-y-1 focus-within:scale-[1.05] focus-within:border-cyprus/25 focus-within:bg-white"
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
            className="group flex min-h-[5.75rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-line/70 bg-cream/80 px-4 py-4 text-center transition-colors hover:border-cyprus/25 hover:bg-white"
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
