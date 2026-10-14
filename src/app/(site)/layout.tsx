import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { WhatsAppWidget } from "@/components/site/whatsapp-widget";
import { getCurrentYear, getSettings } from "@/lib/content";
import { env } from "@/lib/env";
import { mainNav, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/site-config";
import { resolveSiteView } from "@/lib/site-view";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, year] = await Promise.all([getSettings(), getCurrentYear()]);
  const view = resolveSiteView(settings);

  return (
    <>
      <SiteHeader view={view} nav={mainNav} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter
        view={view}
        year={year}
        turnstileSiteKey={env.turnstileSiteKey ?? ""}
      />
      <WhatsAppWidget
        link={view.whatsappLink}
        number={view.whatsappNumber}
        message={WHATSAPP_DEFAULT_MESSAGE}
      />
    </>
  );
}
