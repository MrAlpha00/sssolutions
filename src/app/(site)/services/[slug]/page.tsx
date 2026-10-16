import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import { ServiceIcon } from "@/components/ui/service-icon";
import { BookButton } from "@/components/site/calendly";
import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { ServiceCard } from "@/components/site/service-card";
import {
  getServiceBySlug,
  getServices,
  getSettings,
} from "@/lib/content";
import { createMetadata, serviceJsonLd } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

type Params = { params: Promise<{ slug: string }> };

// Cache Components requires generateStaticParams to return at least one
// result. When no services exist, this reserved slug keeps the build passing;
// the page itself calls notFound() for it since no service matches.
const BUILD_PLACEHOLDER_SLUG = "__build_placeholder__";

export async function generateStaticParams() {
  const services = await getServices();
  if (services.length === 0) {
    return [{ slug: BUILD_PLACEHOLDER_SLUG }];
  }
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) {
    return createMetadata({
      title: "Service not found",
      description: "The service you are looking for could not be found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSettings(),
  ]);

  if (!service) notFound();

  const view = resolveSiteView(settings);
  const related = services.filter((item) => item.id !== service.id).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd(service)) }}
      />

      <PageHero
        eyebrow="Service"
        title={service.title}
        description={service.summary}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
          <article>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
              <ServiceIcon name={service.icon} className="h-6 w-6" />
            </span>
            <div className="mt-8">
              <Prose content={service.description} />
            </div>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <h2 className="text-lg">Discuss this service</h2>
              <p className="mt-2 text-sm text-muted">
                Share a few details about your team and we will suggest how this
                could work for you.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <BookButton url={view.calendlyUrl} className="w-full">
                  Book a Consultation
                </BookButton>
                <ButtonLink
                  href="/contact"
                  variant="secondary"
                  className="w-full"
                >
                  Send an enquiry
                </ButtonLink>
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" aria-hidden />
                  A named point of contact
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" aria-hidden />
                  Clear scope agreed up front
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark" aria-hidden />
                  Confidential handling of your data
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="cream">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl sm:text-3xl">Other services</h2>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyprus"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item.id} service={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <CallToActionBand view={view} />
    </>
  );
}
