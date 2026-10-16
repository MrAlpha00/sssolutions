import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/site/contact-form";
import { LocationModal } from "@/components/site/location-modal";
import { PageHero } from "@/components/site/page-hero";
import { SocialLinks } from "@/components/site/social-links";
import { getServices, getSettings } from "@/lib/content";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Supportive HR Solutions in Bengaluru. Call, email, WhatsApp, or send an enquiry and our team will respond.",
  path: "/contact",
});

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);
  const view = resolveSiteView(settings);
  const turnstileSiteKey = env.turnstileSiteKey ?? "";

  const details = [
    {
      icon: Phone,
      label: "Phone",
      value: view.phone,
      href: view.phoneHref,
    },
    {
      icon: Mail,
      label: "Email",
      value: view.email,
      href: view.emailHref,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: view.whatsappLink,
      external: true,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We would like to hear from you"
        description="Whether you need recruitment support, payroll help, or advice on a people challenge, our team is ready to help."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Details */}
          <div>
            <Eyebrow>Get in touch</Eyebrow>
            <h2 className="mt-4 text-3xl">Our details</h2>
            <p className="mt-4 text-muted">
              Reach us whichever way suits you best. We aim to respond during
              business hours.
            </p>

            <ul className="mt-8 space-y-4">
              {details.map((detail) => (
                <li key={detail.label}>
                  <a
                    href={detail.href}
                    {...(detail.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-cream p-4 transition-colors hover:border-cyprus/25"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
                      <detail.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted">
                        {detail.label}
                      </span>
                      <span className="block truncate font-medium text-cyprus">
                        {detail.value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <Card className="mt-4 p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
                  <MapPin className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-muted">
                    Office
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">
                    {view.address}
                  </p>
                  <div className="mt-3">
                    <LocationModal address={view.address} />
                  </div>
                </div>
              </div>
            </Card>

            {view.businessHours ? (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <Clock className="h-4 w-4 text-leaf-dark" aria-hidden />
                {view.businessHours}
              </p>
            ) : null}

            <SocialLinks social={view.social} className="mt-6" />
          </div>

          {/* Form */}
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl">Send us an enquiry</h2>
            <p className="mt-2 text-sm text-muted">
              Fields marked with <span aria-hidden>*</span> are required.
            </p>
            <div className="mt-6">
              <ContactForm
                services={services.map((service) => ({
                  slug: service.slug,
                  title: service.title,
                }))}
                turnstileSiteKey={turnstileSiteKey}
                phone={view.phone}
              />
            </div>
          </Card>
        </div>
      </Section>

    </>
  );
}
