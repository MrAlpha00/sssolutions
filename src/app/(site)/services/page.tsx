import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { Container, Section } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/card";
import { getServices, getSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { groupServices, serviceSections } from "@/lib/service-groups";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "HR Services",
  description:
    "Recruitment and staffing, payroll and benefits, HR compliance, performance management, employee engagement, and training — practical HR services from Supportive HR Solutions in Bengaluru.",
  path: "/services",
});

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const view = resolveSiteView(settings);
  const grouped = groupServices(services);
  const [hrSection, businessSection] = serviceSections;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="HR support for every stage of growth"
        description="Whether you are hiring your first employee or strengthening an established team, our services are designed to be practical, well-documented, and easy to work with."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      {/* ------------------------------------------- Human Resources solutions */}
      <Section>
        <div className="max-w-2xl">
          <h2 className="text-3xl leading-tight sm:text-4xl">
            {hrSection.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            {hrSection.description}
          </p>
        </div>

        {grouped.hr.length > 0 ? (
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.hr.map((service) => (
              <StaggerItem key={service.id} className="h-full">
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="Services are being updated"
            description="Our service list is being finalised. Please contact us to discuss what you need in the meantime."
          />
        )}
      </Section>

      {/* -------------------------------- Business & workforce support services */}
      {grouped.business.length > 0 ? (
        <Container className="py-14 sm:py-16 lg:py-20">
          <div className="rounded-3xl border border-line bg-cream p-6 sm:p-10 lg:p-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl leading-tight sm:text-4xl">
                {businessSection.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                {businessSection.description}
              </p>
            </div>

            <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {grouped.business.map((service) => (
                <StaggerItem key={service.id} className="h-full">
                  <ServiceCard service={service} surface="sand" />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </Container>
      ) : null}

      <CallToActionBand
        view={view}
        title="Not sure which service you need?"
        description="Tell us about your team and the challenge you are facing. We will help you work out the most sensible starting point."
      />
    </>
  );
}
