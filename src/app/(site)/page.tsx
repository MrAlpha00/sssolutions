import {
  ArrowRight,
  ClipboardCheck,
  Handshake,
  MessageSquareText,
  Quote,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion/reveal";
import {
  fadeLeft,
  fadeRight,
  scaleIn,
} from "@/lib/animations";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { BookButton } from "@/components/site/calendly";
import { ContactForm } from "@/components/site/contact-form";
import { CallToActionBand } from "@/components/site/cta-band";
import { PartnerGrid } from "@/components/site/partner-grid";
import { ResourceCard } from "@/components/site/resource-card";
import { ServiceCard } from "@/components/site/service-card";
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
import { howWeWorkSteps, siteConfig } from "@/lib/site-config";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: `${siteConfig.name} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
});

/**
 * Hero image source — the single place to change when the artwork is ready.
 *
 * The live site currently uses a lightweight transparent SVG placeholder.
 * To use the final artwork, drop a transparent PNG at
 * `public/images/hero-hr-team.png` and change this constant to
 * `"/images/hero-hr-team.png"`.
 */
const HERO_IMAGE_SRC = "/images/hero-team-placeholder.svg";

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
  const [settings, services, partners, testimonials, faqs, posts] =
    await Promise.all([
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
        {/* Restrained leaf-green decorative shapes behind the composition. */}
        <span
          aria-hidden
          className="brand-blob absolute -right-32 top-4 h-[26rem] w-[26rem] bg-leaf/20 blur-[2px]"
        />
        <span
          aria-hidden
          className="absolute -left-28 bottom-0 h-64 w-64 rounded-full bg-cyprus/5 blur-3xl"
        />

        <div className="container-x relative grid items-center gap-12 py-14 lg:grid-cols-[55fr_45fr] lg:gap-16 lg:py-20">
          <div>
            <Reveal>
              <Eyebrow>{view.hero.label}</Eyebrow>
            </Reveal>
            <Reveal>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                {view.hero.heading}
              </h1>
            </Reveal>
            <Reveal>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                {view.hero.description}
              </p>
            </Reveal>

            <Reveal>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/services" size="lg">
                  {view.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <BookButton url={view.calendlyUrl} variant="secondary" size="lg">
                  {view.hero.secondaryCta}
                </BookButton>
              </div>
            </Reveal>

            {view.highlights.length > 0 ? (
              <Reveal>
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
              </Reveal>
            ) : null}
          </div>

          {/* Hero image — a transparent cutout of four HR professionals. The
              decorative green shapes sit behind it and the cutout simply
              overlaps them, so there is no card, frame, or boxed background.

              To use the final artwork, drop a transparent PNG at
              `public/images/hero-hr-team.png` and change HERO_IMAGE_SRC above. */}
          <Reveal variants={scaleIn} className="relative w-full lg:justify-self-end">
            <span
              aria-hidden
              className="brand-blob absolute -right-4 -top-6 h-40 w-40 bg-leaf/20 sm:h-56 sm:w-56"
            />
            <span
              aria-hidden
              className="hero-arch absolute bottom-4 left-1/2 h-2/3 w-3/4 -translate-x-1/2 bg-cyprus/8"
            />
            <Image
              src={HERO_IMAGE_SRC}
              alt="Four HR professionals in corporate attire, ready to support your team"
              width={1200}
              height={860}
              sizes="(min-width: 1024px) 42vw, (min-width: 640px) 70vw, 88vw"
              className="relative z-10 mx-auto h-auto w-full max-w-sm object-contain sm:max-w-md lg:max-w-lg"
              preload
            />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- clients */}
      {partners.length > 0 ? (
        <Section id="clients" tone="cream" className="py-14 sm:py-16">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl sm:text-3xl">Our Clients / Partners</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Relationships built on trust, collaboration, and a shared
                commitment to better workplaces.
              </p>
            </div>
          </Reveal>
          <div className="mt-10">
            <PartnerGrid partners={partners} />
          </div>
        </Section>
      ) : null}

      {/* -------------------------------------------------------------- about */}
      <Section id="about">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal variants={fadeLeft}>
            <div className="relative">
              <span
                aria-hidden
                className="brand-blob absolute -left-4 -top-4 h-full w-full bg-leaf/15"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
                <Image
                  src="/images/about-collaboration.jpg"
                  alt="Two colleagues in conversation at a desk in a warm, naturally lit workplace"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <Card className="absolute -bottom-6 -right-2 max-w-[16rem] border-cyprus/15 bg-cyprus p-5 text-sand shadow-card sm:right-6">
                <Quote className="h-6 w-6 text-leaf" aria-hidden />
                <p className="mt-3 text-sm leading-relaxed">
                  Our work is about people. When HR is done well, employees
                  feel supported and businesses perform better.
                </p>
                <p className="mt-3 text-xs text-sand/70">
                  {siteConfig.managingDirector}, Managing Director
                </p>
              </Card>
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="About us"
              title="Helping businesses get the people side of work right"
              description={view.description}
            />
            <Reveal>
              <div className="mt-6 space-y-4 text-muted">
                <p>
                  Supportive HR Solutions is a Bengaluru-based HR services firm.
                  We work alongside founders, HR teams, and managers who need
                  dependable help with hiring, payroll, compliance, and the
                  everyday people questions that shape a workplace.
                </p>
                <p>
                  Our approach is deliberately hands-on. We start by
                  understanding how your team operates today, then put in place
                  processes that are simple enough to keep running after we step
                  back.
                </p>
              </div>
            </Reveal>

            <StaggerGroup className="mt-8 space-y-3">
              {values.map((value) => (
                <StaggerItem key={value}>
                  <div className="flex items-start gap-3 text-sm text-ink">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf-dark">
                      <Users className="h-3 w-3" />
                    </span>
                    {value}
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------ services */}
      <Section tone="cream">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="HR services built around your business"
            description="From hiring the right person to keeping records and policies in order, our services can stand alone or work together as ongoing HR support."
          />
          <Reveal>
            <ButtonLink href="/services" variant="secondary">
              View all services
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {highlightedServices.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* ----------------------------------------------------- why choose us */}
      <Section id="why-choose-us">
        <Reveal>
          <SectionHeading
            eyebrow="Why choose us"
            title="A partner who stays practical"
            description="We are measured by whether our work makes your team's day-to-day easier — not by how complicated we can make it."
          />
        </Reveal>
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

      {/* -------------------------------------------------------- how we work */}
      <Section id="how-we-work" tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title="A simple, transparent way of working"
              description="No jargon, no surprises. Every engagement follows the same straightforward path — sized to fit your actual need."
            />
          </Reveal>
          <StaggerGroup className="space-y-5">
            {howWeWorkSteps.map((item) => (
              <StaggerItem key={item.step}>
                <div className="flex gap-5 rounded-2xl border border-line bg-sand/60 p-6">
                  <span
                    aria-hidden
                    className="font-heading text-3xl font-semibold text-cyprus/25"
                  >
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Section>

      {/* -------------------------------------------------------- testimonials */}
      <Section id="testimonials">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="What our clients say"
            description="We only publish feedback we have received and permission to share. Client testimonials appear here once approved."
          />
        </Reveal>
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
                      <p className="font-medium text-cyprus">
                        {testimonial.author_name}
                      </p>
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
              className="inline-flex items-center gap-2 text-sm font-medium text-cyprus transition-colors hover:text-cyprus-dark"
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
            <Reveal>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions, answered"
                description="A few things clients often ask before working with us. If your question is not here, just ask."
              />
            </Reveal>
            <Reveal variants={fadeRight}>
              <Accordion
                items={faqs.map((faq) => ({
                  id: faq.id,
                  question: faq.question,
                  answer: faq.answer,
                }))}
              />
            </Reveal>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------- contact */}
      <Section id="contact">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal variants={fadeLeft}>
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                Tell us what you need
              </h2>
              <p className="mt-4 text-muted">
                Complete the form and we will get back to you. Prefer to talk?
                Call{" "}
                <a
                  href={view.phoneHref}
                  className="font-medium text-cyprus underline underline-offset-2"
                >
                  {view.phone}
                </a>{" "}
                or email{" "}
                <a
                  href={view.emailHref}
                  className="font-medium text-cyprus underline underline-offset-2"
                >
                  {view.email}
                </a>
                .
              </p>

              <ul className="mt-8 space-y-4 text-sm">
                <li className="flex items-start gap-3 text-muted">
                  <MessageSquareText
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark"
                    aria-hidden
                  />
                  Enquiries are answered by a named consultant, not a queue.
                </li>
                <li className="flex items-start gap-3 text-muted">
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-leaf-dark"
                    aria-hidden
                  />
                  Your details stay confidential and are never shared.
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal variants={fadeRight}>
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
          </Reveal>
        </div>
      </Section>

      <CallToActionBand view={view} />
    </>
  );
}
