"use client";

import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";

import type { Partner } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Clients / partners logo gallery.
 *
 * No partner logos are invented. When a logo file has been uploaded it is
 * displayed; otherwise the company name is shown as a restrained wordmark.
 *
 * Desktop: two slow, opposite-direction marquee rows (paused on hover/focus).
 * Mobile and reduced-motion: a simple, accessible grid.
 */
export function PartnerGrid({ partners }: { partners: Partner[] }) {
  const reduce = useReducedMotion();

  const [rowA, rowB] = useMemo(() => {
    const middle = Math.ceil(partners.length / 2);
    return [partners.slice(0, middle), partners.slice(middle)];
  }, [partners]);

  if (partners.length === 0) return null;

  const tile = (partner: Partner, duplicated = false) => (
    <li
      key={`${partner.id}-${duplicated ? "copy" : "original"}`}
      aria-hidden={duplicated || undefined}
      className="group mx-3 flex h-[4.5rem] w-56 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-cream/80 px-5 text-center transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:scale-[1.05] hover:border-cyprus/25 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(0,51,46,0.45)] focus-within:z-10 focus-within:-translate-y-1 focus-within:scale-[1.05] focus-within:border-cyprus/25 focus-within:bg-white"
    >
      {partner.logo_url ? (
        <span
          role="img"
          aria-label={partner.name}
          className="h-9 w-full bg-contain bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundImage: `url(${partner.logo_url})` }}
        />
      ) : (
        <span className="font-heading text-sm font-medium leading-snug text-cyprus/85 transition-colors group-hover:text-cyprus">
          {partner.name}
        </span>
      )}
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
            className="flex min-h-[4.5rem] items-center justify-center rounded-xl border border-line/70 bg-cream/80 px-4 py-4 text-center transition-colors hover:border-cyprus/25 hover:bg-white"
          >
            {partner.logo_url ? (
              <span
                role="img"
                aria-label={partner.name}
                className="h-9 w-full bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${partner.logo_url})` }}
              />
            ) : (
              <span className="text-sm font-medium leading-snug text-cyprus">
                {partner.name}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={cn(
        "relative -mx-6 overflow-hidden py-2 sm:-mx-8 lg:-mx-10",
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
