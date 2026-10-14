import { ArrowRight, LifeBuoy } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";

export default function SiteNotFound() {
  return (
    <Section tone="cream" className="py-20">
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow className="justify-center">Error 404</Eyebrow>
        <p className="mt-6 font-heading text-6xl text-cyprus">404</p>
        <h1 className="mt-4 text-3xl sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-muted">
          We could not find the page you were looking for. It may have been moved,
          or the link may be out of date.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">
            Back to home
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            <LifeBuoy className="h-4 w-4" />
            Contact us
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
