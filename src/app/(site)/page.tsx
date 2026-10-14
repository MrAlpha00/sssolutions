import {
  ArrowRight,
  ClipboardCheck,
  Handshake,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { BookButton } from "@/components/site/calendly";
import { ContactForm } from "@/components/site/contact-form";
import { CallToActionBand } from "@/components/site/cta-band";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { PartnerGrid } from "@/components/site/partner-grid";
import { ResourceCard } from "@/components/site/resource-card";
import { ServiceCard } from "@/components/site/service-card";
import { SocialLinks } from "@/components/site/social-links";
import {
  getFaqs,
  getPartners,
  getPosts,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/content";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

const reasons = [
  {
    icon: Target,
    title: "Practical, not theoretical",
    description:
      "We focus on processes your managers will actually use — lightweight, repeatable, and shaped around the way your business already works.",
  },
  {
    icon: Handshake,
    title: "A partner, not a vendor",
    description:
      "You get a named point of contact who understands your context, rather than a rotating queue of tickets.",
  },
  {
    icon: ShieldCheck,
    title: "Confidential by default",
    description:
      "Employee and payroll information is sensitive. We handle it with clear access and careful record-keeping.",
  },
  {
    icon: ClipboardCheck,
    title: "Clear scope, honest advice",
    description:
      "We tell you what we can help with, what we cannot, and when a matter needs a qualified specialist.",
  },
];

const values = [
  "Respect for people at every step of the employee journey",
  "Straightforward communication — no jargon, no surprises",
  "Practical documentation that stands up to scrutiny",
  "Continuous improvement informed by real feedback",
];

export default async function HomePage() {
  const [settings, services, partners, testimonials, faqs, posts] = await Promise.all([
    getSettings(),
    getServices(),
    getPartners(),
    getTestimonials(),
    getFaqs(),
    getPosts(),
  ]);

  const view = resolveSiteView(settings);
  const highlightedServices = services.slice(0, 6);
  const latestPosts = posts.slice(0, 3);
  const turnstileSiteKey = env.turnstileSiteKey ?? "";

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden bg-sand">
        <span
          aria-hidden
          className="brand-blob absolute -right-24 top-8 h-80 w-80 bg-leaf/15"
        />
        <span
          aria-hidden
          className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyprus/5 blur-3xl"
        />
        <div className="container-x relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <Eyebrow>{view.hero.label}</Eyebrow>
            <h1 className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.5rem]">
              {view.hero.heading}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {view.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/services" size="lg">
                {view.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <BookButton url={view.calendlyUrl} variant="secondary" size="lg">
                {view.hero.secondaryCta}
              </BookButton>
            </div>

            {view.highlights.length > 0 ? (
              <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
                {view.highlights.map((highlight) => (
                  <div key={highlight.label}>
                    <dt className="text-sm text-muted">{highlight.label}</dt>
                    <dd className="mt-1 font-heading text-3xl text-cyprus">
                      {highlight.value}
                      {highlight.suffix ?? ""}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <Reveal className="lg:justify-self-end">
            <Card className="w-full max-w-md border-cyprus/15 bg-cream p-7 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-dark">
                Talk to us
              </p>
              <h2 className="mt-3 text-2xl">Let&apos;s find the right support</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Share what you are working on and we will suggest a practical next
                step — whether that is recruitment, payroll support, or building a
                people process from scratch.
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href={view.phoneHref}
                    className="flex items-center gap-3 text-cyprus"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyprus/8">
                      <Phone className="h-4 w-4" />
                    </span>
                    {view.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={view.emailHref}
                    className="flex items-center gap-3 break-all text-cyprus"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyprus/8">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    {view.email}
                  </a>
                </li>
              </ul>

              <div className="mt-6 flex flex-col gap-3">
                <ButtonLink href="/contact" variant="primary">
                  Contact us
                </ButtonLink>
                <SocialLinks social={view.social} className="justify-center" />
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- clients */}
      {partners.length > 0 ? (
        <Section id="clients" tone="cream" className="py-14 sm:py-16">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Trusted by teams across Bengaluru and beyond
            </p>
          </div>
          <div className="mt-8">
            <PartnerGrid partners={partners} />
          </div>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- about */}
      <Section id="about">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="Helping businesses get the people side of work right"
              description={
                view.description
              }
            />
            <div className="mt-6 space-y-4 text-muted">
              <p>
                Supportive HR Solutions is a Bengaluru-based HR services firm. We
                work alongside founders, HR teams, and managers who need dependable
                help with hiring, payroll, compliance, and the everyday people
                questions that shape a workplace.
              </p>
              <p>
                Our approach is deliberately hands-on. We start by understanding
                how your team operates today, then put in place processes that are
                simple enough to keep running after we step back.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {values.map((value) => (
                <li key={value} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf-dark">
                    <Users className="h-3 w-3" />
                  </span>
                  {value}
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-cyprus text-sand sm:col-span-2">
                <Quote className="h-7 w-7 text-leaf" aria-hidden />
                <p className="mt-4 text-lg leading-relaxed text-sand">
                  Our work is about people. When HR is done well, employees feel
                  supported and businesses perform better.
                </p>
                <p className="mt-5 text-sm text-sand/70">
                  {siteConfig.managingDirector}, Managing Director
                </p>
              </Card>
              <Card>
                <p className="font-heading text-lg text-cyprus">For growing teams</p>
                <p className="mt-2 text-sm text-muted">
                  Build the HR foundations before they become urgent.
                </p>
              </Card>
              <Card>
                <p className="font-heading text-lg text-cyprus">For established teams</p>
                <p className="mt-2 text-sm text-muted">
                  Strengthen the processes you already have in place.
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------------ services */}
      <Section tone="cream">
        <SectionHeading
          eyebrow="What we do"
          title="HR services built around your business"
          description="From hiring the right person to keeping records and policies in order, our services can stand alone or work together as ongoing HR support."
        />
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlightedServices.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="mt-10">
          <ButtonLink href="/services" variant="secondary">
            View all services
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Section>

      {/* ----------------------------------------------------- why choose us */}
      <Section id="why-choose-us">
        <SectionHeading
          eyebrow="Why choose us"
          title="A partner who stays practical"
          description="We are measured by whether our work makes your team's day-to-day easier — not by how complicated we can make it."
        />
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2">
          {reasons.map((reason) => (
            <StaggerItem key={reason.title} className="h-full">
              <Card className="flex h-full gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
                  <reason.icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {reason.description}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* -------------------------------------------------------- testimonials */}
      <Section id="testimonials" tone="cream">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients say"
          description="We only publish feedback we have received and permission to share. Client testimonials appear here once approved."
        />
        <div className="mt-10">
          {testimonials.length > 0 ? (
            <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <StaggerItem key={testimonial.id} className="h-full">
                  <Card className="flex h-full flex-col">
                    <Quote className="h-6 w-6 text-leaf" aria-hidden />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink">
                      {testimonial.quote}
                    </blockquote>
                    <footer className="mt-5 text-sm">
                      <p className="font-medium text-cyprus">{testimonial.author_name}</p>
                      {testimonial.author_role || testimonial.company ? (
                        <p className="text-muted">
                          {[testimonial.author_role, testimonial.company]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      ) : null}
                    </footer>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <EmptyState
              title="Testimonials coming soon"
              description="We are collecting feedback from the clients we work with. Instead of writing them ourselves, we will publish real, approved testimonials here as soon as they are ready."
              action={
                <ButtonLink href="/contact" variant="secondary">
                  Work with us
                </ButtonLink>
              }
            />
          )}
        </div>
      </Section>

      {/* ----------------------------------------------------------- resources */}
      {latestPosts.length > 0 ? (
        <Section>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Resources"
              title="HR insights and practical guides"
            />
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyprus"
            >
              All resources
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <StaggerItem key={post.id} className="h-full">
                <ResourceCard post={post} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Section>
      ) : null}

      {/* ----------------------------------------------------------------- faq */}
      {faqs.length > 0 ? (
        <Section id="faq" tone="cream">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions, answered"
              description="A few things clients often ask before working with us. If your question is not here, just ask."
            />
            <Accordion
              items={faqs.map((faq) => ({
                id: faq.id,
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------- contact */}
      <Section id="contact">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl">Tell us what you need</h2>
            <p className="mt-4 text-muted">
              Complete the form and we will get back to you. Prefer to talk? Call{" "}
              <a href={view.phoneHref} className="font-medium text-cyprus underline underline-offset-2">
                {view.phone}
              </a>{" "}
              or email{" "}
              <a href={view.emailHref} className="font-medium text-cyprus underline underline-offset-2">
                {view.email}
              </a>
              .
            </p>

            <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
              <p className="text-sm font-medium text-cyprus">Prefer email updates?</p>
              <p className="mt-1 text-sm text-muted">
                Subscribe and we will send occasional HR insights.
              </p>
              <div className="mt-4">
                <NewsletterForm turnstileSiteKey={turnstileSiteKey} />
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <ContactForm
              services={services.map((service) => ({
                slug: service.slug,
                title: service.title,
              }))}
              turnstileSiteKey={turnstileSiteKey}
              phone={view.phone}
            />
          </Card>
        </div>
      </Section>

      <CallToActionBand view={view} />
    </>
  );
}
