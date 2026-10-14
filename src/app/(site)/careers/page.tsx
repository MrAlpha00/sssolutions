import { Briefcase, MapPin } from "lucide-react";

import { Card, EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import { Eyebrow, SectionHeading } from "@/components/ui/section-heading";
import { ApplicationForm } from "@/components/site/application-form";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { getJobs, getSettings } from "@/lib/content";
import { env } from "@/lib/env";
import { createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "Careers",
  description:
    "Explore open roles at Supportive HR Solutions, or send a general application to join our team in Bengaluru.",
  path: "/careers",
});

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getJobs(), getSettings()]);
  const view = resolveSiteView(settings);
  const turnstileSiteKey = env.turnstileSiteKey ?? "";

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build your career in HR"
        description="We are always interested in hearing from people who care about doing HR well. Explore our open roles below, or send us a general application."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      <Section>
        <SectionHeading
          eyebrow="Open roles"
          title="Current opportunities"
          description="Roles appear here as they open. If you do not see a match, a general application is welcome."
        />

        <div className="mt-10">
          {jobs.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2">
              {jobs.map((job) => (
                <Card as="li" key={job.id} className="flex h-full flex-col p-6">
                  <h3 className="text-lg">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-leaf-dark" aria-hidden />
                      {job.location}
                    </span>
                    {job.employment_type ? (
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-leaf-dark" aria-hidden />
                        {job.employment_type}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 flex-1 text-sm text-muted">
                    <Prose content={job.description} className="text-sm" />
                  </div>
                  {job.requirements ? (
                    <div className="mt-4 border-t border-line pt-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        What we are looking for
                      </p>
                      <div className="mt-2 text-sm text-muted">
                        <Prose content={job.requirements} className="text-sm" />
                      </div>
                    </div>
                  ) : null}
                </Card>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No open roles right now"
              description="We do not have any advertised vacancies at the moment, but we are always happy to receive a general application from people who share our approach to HR."
            />
          )}
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Apply</Eyebrow>
            <h2 className="mt-4 text-3xl">Send your application</h2>
            <p className="mt-4 text-muted">
              Attach your resume and tell us briefly why you would be a good fit.
              We review every application and will be in touch if there is a match.
            </p>
            <p className="mt-4 text-sm text-muted">
              If you would prefer to email us directly, write to{" "}
              <a
                href={view.emailHref}
                className="font-medium text-cyprus underline underline-offset-2"
              >
                {view.email}
              </a>
              .
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <ApplicationForm
              jobs={jobs.map((job) => ({
                id: job.id,
                title: job.title,
                location: job.location,
              }))}
              turnstileSiteKey={turnstileSiteKey}
            />
          </Card>
        </div>
      </Section>
    </>
  );
}
