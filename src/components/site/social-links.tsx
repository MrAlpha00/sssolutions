import type { ComponentType } from "react";

import type { SocialLink } from "@/lib/site-config";
import type { SiteView } from "@/lib/site-view";
import { cn } from "@/lib/utils";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "./brand-icons";

const iconFor: Record<SocialLink["key"], ComponentType<{ className?: string }>> = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  x: XIcon,
  youtube: YouTubeIcon,
};

export function SocialLinks({
  social,
  tone = "dark",
  className,
  itemClassName,
}: {
  social: SiteView["social"];
  tone?: "dark" | "light";
  className?: string;
  itemClassName?: string;
}) {
  if (social.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {social.map((item) => {
        const Icon = iconFor[item.key];
        return (
          <li key={item.key}>
            <a
              href={item.url as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.label} (opens in a new tab)`}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                tone === "dark"
                  ? "border-line text-cyprus hover:bg-cyprus hover:text-sand"
                  : "border-sand/30 text-sand hover:bg-sand hover:text-cyprus",
                itemClassName,
              )}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
