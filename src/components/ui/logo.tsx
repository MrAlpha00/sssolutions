import { cn } from "@/lib/utils";

/**
 * Brand treatment.
 *
 * NOTE: The client's real logo (from the supplied business card) has not yet
 * been provided. This is a restrained SS monogram placeholder in the brand
 * colours — it does NOT attempt to recreate the company's actual logo. Replace
 * `<Mark />` with the supplied asset at `public/brand/logo.svg` (or .png)
 * before launch. See README → "Logo and image assets".
 */
function Mark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyprus font-heading text-[0.95rem] font-semibold tracking-[0.02em] text-sand",
        className,
      )}
    >
      SS
    </span>
  );
}

export function BrandLogo({
  tone = "dark",
  className,
  compact = false,
}: {
  tone?: "dark" | "light";
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Mark />
      {!compact ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading text-base font-semibold tracking-tight sm:text-lg",
              tone === "dark" ? "text-cyprus" : "text-sand",
            )}
          >
            Supportive HR
          </span>
          <span
            className={cn(
              "mt-1 text-[0.68rem] font-medium uppercase tracking-[0.22em]",
              tone === "dark" ? "text-muted" : "text-sand/70",
            )}
          >
            Solutions
          </span>
        </span>
      ) : null}
      <span className="sr-only">Supportive HR Solutions</span>
    </span>
  );
}
