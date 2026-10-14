import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { ServiceCard } from "@/components/site/service-card";
import { Section } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/card";
import { getServices, getSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
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

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="HR support for every stage of growth"
        description="Whether you are hiring your first employee or strengthening an established team, our services are designed to be practical, well-documented, and easy to work with."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <Section>
        {services.length > 0 ? (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
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

      <CallToActionBand
        view={view}
        title="Not sure which service you need?"
        description="Tell us about your team and the challenge you are facing. We will help you work out the most sensible starting point."
      />
    </>
  );
}
