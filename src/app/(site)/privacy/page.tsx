import { CallToActionBand } from "@/components/site/cta-band";
import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/site/prose";
import { Section } from "@/components/ui/container";
import { getSettings } from "@/lib/content";
import { createMetadata } from "@/lib/seo";
import { resolveSiteView } from "@/lib/site-view";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "How Supportive HR Solutions collects, uses, and protects personal information submitted through this website.",
  path: "/privacy",
});

/**
 * NOTE (client action): This is a practical starting point written for the
 * website's actual data flows — contact enquiries, newsletter subscriptions,
 * and job applications. It must be reviewed against applicable law (for
 * example India's DPDP Act) and the company's real internal practices, and
 * updated before launch.
 */
const content = `## Overview

Supportive HR Solutions ("we", "us") respects your privacy. This policy explains what personal information we collect through this website, why we collect it, and how we handle it.

## Information we collect

We only collect information you choose to give us through our forms:

- **Contact enquiries** — your name, email address, and any phone number, company name, service interest, and message you provide.
- **Newsletter subscriptions** — your email address and your consent.
- **Job applications** — your name, email address, phone number, the role you are applying for, any cover note, and the resume file you attach.

We also receive basic technical information (such as your IP address) automatically when you submit a form, which we use only for security and to prevent spam.

## How we use your information

We use the information you provide to:

- respond to your enquiry and communicate with you about it;
- send you email updates if you have subscribed;
- assess job applications and contact candidates about roles.

We do not sell your personal information, and we do not use it for automated decision-making.

## Consent

By submitting a form you confirm that you have read this policy and consent to us using your information for the purpose described. You can withdraw your consent at any time by contacting us.

## Confidentiality and security

We treat employee, payroll, and candidate information as confidential. Access is limited to those who need it, and we use reputable third-party providers for hosting, email delivery, and spam protection. Resumes are stored securely and made available only to authorised staff involved in recruitment.

## Sharing

We share personal information only with service providers who help us operate this website (such as our hosting, email, and anti-spam providers), and only as needed to provide those services. We may also disclose information where we are required to do so by law.

## Retention

We keep enquiry and application information only for as long as it is needed for the purpose it was provided, or as required by law. You may ask us to delete your information at any time.

## Your rights

You can ask us to access, correct, or delete the personal information we hold about you, or to stop sending you email updates. Contact us using the details below and we will respond within a reasonable period.

## Cookies

This website uses only the cookies necessary for it to function securely. We do not use advertising or tracking cookies.

## Changes to this policy

We may update this policy from time to time. The current version will always be available on this page.

## Contact us

If you have any questions about this policy or how we handle your information, please contact us using the details in the footer of this website.`;

export default async function PrivacyPage() {
  const settings = await getSettings();
  const view = resolveSiteView(settings);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we handle the personal information you share with us through this website."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <Prose content={content} />
          <p className="mt-10 rounded-xl border border-line bg-cream px-4 py-3 text-xs text-muted">
            This policy is a general template and should be reviewed against the
            specific legal requirements that apply to your organisation before it
            is relied upon.
          </p>
        </div>
      </Section>
      <CallToActionBand view={view} />
    </>
  );
}
