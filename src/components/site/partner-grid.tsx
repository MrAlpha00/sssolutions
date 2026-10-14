import type { Partner } from "@/lib/types";

/**
 * Client / partner names.
 *
 * No partner logos are invented. When a logo file has been uploaded it is shown
 * as a background image; otherwise the name is displayed as a text card.
 */
export function PartnerGrid({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((partner) => (
        <li
          key={partner.id}
          className="flex min-h-[5rem] items-center justify-center rounded-xl border border-line bg-cream px-4 py-4 text-center"
        >
          {partner.logo_url ? (
            <span
              role="img"
              aria-label={partner.name}
              className="h-10 w-full bg-contain bg-center bg-no-repeat"
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
