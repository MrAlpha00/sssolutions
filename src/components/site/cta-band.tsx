import { Reveal } from "@/components/motion/reveal";
import { BookButton } from "@/components/site/calendly";
import type { SiteView } from "@/lib/site-view";

/**
 * Closing call-to-action band. The primary button opens the Calendly popup when
 * a scheduling URL is configured, otherwise it falls back to the contact page —
 * we never invent a booking link.
 */
export function CallToActionBand({
  view,
  title,
  description,
}: {
  view: SiteView;
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-cyprus">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-cyprus-dark px-6 py-12 sm:px-12 sm:py-14">
          <span
            aria-hidden
            className="brand-blob absolute -right-16 -top-20 h-64 w-64 bg-leaf/20"
          />
          <span
            aria-hidden
            className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-leaf/10 blur-2xl"
          />
          <Reveal className="relative">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl text-sand sm:text-4xl">
                  {title ?? "Ready to strengthen your team?"}
                </h2>
                <p className="mt-4 text-sand/75">
                  {description ??
                    "Tell us what you are working on and we will suggest a practical next step. No obligation, no hard sell."}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <BookButton url={view.calendlyUrl} variant="light" size="lg">
                  Book a Consultation
                </BookButton>
                <a
                  href={view.emailHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-sand/40 px-7 py-3.5 text-base font-medium text-sand transition-colors hover:bg-sand hover:text-cyprus"
                >
                  Send an enquiry
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
