import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { ResourceCard } from "@/components/site/resource-card";
import { Section } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPostBySlug, getPosts, getSettings } from "@/lib/content";
import { articleJsonLd, createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";
import { formatDate } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

// Cache Components requires generateStaticParams to return at least one
// result. When no posts exist, this reserved slug keeps the build passing;
// the page itself calls notFound() for it since no post matches.
const BUILD_PLACEHOLDER_SLUG = "__build_placeholder__";

export async function generateStaticParams() {
  const posts = await getPosts();
  if (posts.length === 0) {
    return [{ slug: BUILD_PLACEHOLDER_SLUG }];
  }
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return createMetadata({
      title: "Article not found",
      description: "The article you are looking for could not be found.",
      path: `/resources/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: post.seo_title ?? post.title,
    description: post.seo_description ?? post.summary,
    path: `/resources/${post.slug}`,
    type: "article",
    publishedTime: post.published_at ?? post.created_at,
  });
}

export default async function ResourceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([
    getPostBySlug(slug),
    getPosts(),
    getSettings(),
  ]);

  if (!post) notFound();

  const view = resolveSiteView(settings);
  const more = posts.filter((item) => item.id !== post.id).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post)) }}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.summary}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "/resources" },
          { label: post.title },
        ]}
      >
        <p className="mt-6 text-sm text-muted">
          <time dateTime={post.published_at ?? post.created_at}>
            {formatDate(post.published_at ?? post.created_at)}
          </time>
          {post.author ? <span> · {post.author}</span> : null}
        </p>
      </PageHero>

      <Section>
        <div className="mx-auto max-w-3xl">
          <Prose content={post.content} />
          <div className="mt-12 border-t border-line pt-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-medium text-cyprus"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all resources
            </Link>
          </div>
        </div>
      </Section>

      {more.length > 0 ? (
        <Section tone="cream">
          <SectionHeading eyebrow="Keep reading" title="More resources" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {more.map((item) => (
              <ResourceCard key={item.id} post={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <CallToActionBand
        view={view}
        title="Want help applying this in your organisation?"
        description="Tell us what you are working on and we will suggest a practical next step."
      />
    </>
  );
}
