import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { Section } from "@/components/ui/container";
import { getSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "Terms of Use",
  description:
    "The terms that apply when you use the Supportive HR Solutions website.",
  path: "/terms",
});

/**
 * NOTE (client action): Review and adapt these website terms with the client's
 * adviser before launch.
 */
const content = `## Acceptance of these terms

By using this website you agree to these terms of use. If you do not agree with them, please do not use the website.

## About this website

This website provides general information about Supportive HR Solutions and the HR services we offer. The content is provided for general information only.

## No professional advice

Nothing on this website constitutes legal, financial, or professional advice. HR and employment matters depend on your specific circumstances and the law that applies to you. You should obtain appropriate advice before acting on anything you read here.

## Enquiries and submissions

When you submit an enquiry, subscribe to our newsletter, or apply for a role, you confirm that the information you provide is accurate and that you are entitled to share it. We handle that information in line with our Privacy Policy.

## Intellectual property

The content, branding, and design of this website belong to Supportive HR Solutions or are used with permission, and may not be reproduced without consent.

## Third-party links

This website may link to third-party sites we do not control. We are not responsible for the content or practices of those sites.

## Availability

We aim to keep this website available and accurate, but we do not guarantee that it will always be free of errors or interruptions.

## Limitation of liability

To the extent permitted by law, Supportive HR Solutions is not liable for any loss arising from your use of, or reliance on, this website.

## Governing law

These terms are governed by the laws of India, and any dispute will be subject to the jurisdiction of the courts of Bengaluru, Karnataka.

## Changes

We may update these terms from time to time. The current version will always be available on this page.`;

export default async function TermsPage() {
  const settings = await getSettings();
  const view = resolveSiteView(settings);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The terms that apply when you use this website."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Prose content={content} />
          <p className="mt-10 rounded-xl border border-line bg-cream px-4 py-3 text-xs text-muted">
            These terms are a general template and should be reviewed against the
            specific requirements that apply to your organisation before they are
            relied upon.
          </p>
        </div>
      </Section>
      <CallToActionBand view={view} />
    </>
  );
}
