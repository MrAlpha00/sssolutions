import { cn } from "@/lib/utils";

/**
 * Brand treatment.
 *
 * NOTE: The client's real logo (from the supplied business card) has not yet
 * been provided. This is an intentionally abstract, on-brand placeholder mark —
 * it does NOT attempt to recreate the company's actual logo. Replace the
 * `<Mark />` SVG with the supplied asset at `public/brand/logo.svg` (or .png)
 * before launch. See README → "Logo and image assets".
 */
function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      role="img"
      aria-hidden="true"
      className={cn("h-10 w-10 shrink-0", className)}
    >
      <circle cx="22" cy="22" r="22" fill="var(--color-cyprus)" />
      <path
        d="M31 12.6C20.2 12.6 12 19.3 12 27.6c0 .4 0 .8.1 1.2 6.1-1.5 10.7-4.7 13.7-9.6-2.3 5-6.7 8.6-12.5 10.3 1.5 2.2 4.5 3.6 8.4 3.6 7.3 0 11.9-7.1 11.9-15.2 0-2.3-.4-4.4-1-6.1-.6.1-1.3.2-2.1.2Z"
        fill="var(--color-leaf)"
      />
      <path
        d="M22.6 33.1c.5-7.4 3.4-13.6 7.4-18.1-.6-.1-1.3-.2-2.1-.2-1.4 3.9-3.7 7.4-6.7 10.2 1-4.5 2.8-8.3 5.2-11.3-1.5-.5-3.2-.8-5-.8-.5 6.9-3.3 13.5-7.2 18.6 2 1 4.3 1.6 6.7 1.6.5 0 1.1 0 1.7-.1Z"
        fill="var(--color-sand)"
        opacity="0.9"
      />
    </svg>
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
              "font-heading text-lg font-semibold tracking-tight",
              tone === "dark" ? "text-cyprus" : "text-sand",
            )}
          >
            Supportive HR
          </span>
          <span
            className={cn(
              "mt-1 text-[0.7rem] font-medium uppercase tracking-[0.2em]",
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
