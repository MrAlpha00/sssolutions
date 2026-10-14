import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { ResourceCard } from "@/components/site/resource-card";
import { EmptyState } from "@/components/ui/card";
import { Section } from "@/components/ui/container";
import { getPosts, getSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "HR Resources & Insights",
  description:
    "Practical articles and guides on recruitment, payroll, performance, compliance, and building better workplaces — from the team at Supportive HR Solutions.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const [posts, settings] = await Promise.all([getPosts(), getSettings()]);
  const view = resolveSiteView(settings);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="HR insights you can actually use"
        description="Short, practical articles on the people challenges we help businesses work through every week."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      <Section>
        {posts.length > 0 ? (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <StaggerItem key={post.id} className="h-full">
                <ResourceCard post={post} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <EmptyState
            title="Articles are on the way"
            description="We are preparing practical HR articles for this section. In the meantime, get in touch if there is a topic you would like us to cover."
          />
        )}
      </Section>

      <CallToActionBand
        view={view}
        title="Have a people question?"
        description="If you are working through an HR challenge, we are happy to talk it through — no obligation."
      />
    </>
  );
}
