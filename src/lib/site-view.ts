import { env } from "@/lib/env";
import {
  getFormattedAddress,
  siteConfig,
  socialLabels,
  WHATSAPP_DEFAULT_MESSAGE,
  type SocialLink,
} from "@/lib/site-config";
import type { HighlightStat, SiteSettings } from "@/lib/types";
import { phoneDigits, whatsappUrl } from "@/lib/utils";

/**
 * A resolved, display-ready view of the site's public details.
 *
 * It merges the static defaults in `site-config.ts` with any values the client
 * has edited in the admin dashboard, and only ever exposes social links that
 * are actually configured (never invented links).
 *
 * Server-only: it reads `env`. Render it in a Server Component and pass the
 * resulting plain object down to client components as props.
 */

export interface SiteView {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  domain: string;
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  whatsappNumber: string;
  whatsappLink: string;
  address: string;
  addressLines: string[];
  businessHours: string | null;
  calendlyUrl: string;
  social: SocialLink[];
  hero: {
    label: string;
    heading: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  highlights: HighlightStat[];
}

function pick(value: string | null | undefined, fallback: string): string {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export function resolveSiteView(settings: SiteSettings): SiteView {
  const socialMap: Record<SocialLink["key"], string | null> = {
    linkedin: settings.social_linkedin || siteConfig.social.linkedin,
    instagram: settings.social_instagram || siteConfig.social.instagram,
    facebook: settings.social_facebook || siteConfig.social.facebook,
    x: settings.social_x || siteConfig.social.x,
    youtube: siteConfig.social.youtube,
  };

  const social = (Object.keys(socialMap) as SocialLink["key"][])
    .map((key) => ({ key, label: socialLabels[key], url: socialMap[key] }))
    .filter((item): item is SocialLink => Boolean(item.url));

  const phone = pick(settings.phone, siteConfig.phone);
  const email = pick(settings.email, siteConfig.email);
  const whatsappNumber = pick(settings.whatsapp_number, siteConfig.whatsappNumber);
  const address = pick(settings.address, getFormattedAddress());
  // Precedence: admin setting → NEXT_PUBLIC_CALENDLY_URL → site-config default.
  const calendlyUrl = pick(
    settings.calendly_url,
    env.calendlyUrl || siteConfig.calendlyUrl || "",
  );

  return {
    name: siteConfig.name,
    shortName: siteConfig.shortName,
    tagline: pick(settings.tagline, siteConfig.tagline),
    description: pick(settings.company_description, siteConfig.description),
    domain: siteConfig.domain,
    phone,
    phoneHref: `tel:${phoneDigits(phone)}`,
    email,
    emailHref: `mailto:${email}`,
    whatsappNumber,
    whatsappLink: whatsappUrl(whatsappNumber, WHATSAPP_DEFAULT_MESSAGE),
    address,
    addressLines: address
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean),
    businessHours: settings.business_hours?.trim() || siteConfig.businessHours,
    calendlyUrl,
    social,
    hero: {
      label: pick(settings.hero_label, "ONE PARTNER FOR YOUR ENTIRE WORKFORCE"),
      heading: pick(
        settings.hero_heading,
        "Building Strong Teams. Creating Better Workplaces.",
      ),
      description: pick(settings.hero_description, siteConfig.description),
      primaryCta: pick(settings.hero_primary_cta, "Explore Our Services"),
      secondaryCta: pick(settings.hero_secondary_cta, "Book a Consultation"),
    },
    highlights: (settings.highlights ?? []).filter((item) =>
      Number.isFinite(item.value),
    ),
  };
}
