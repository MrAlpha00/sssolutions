import { Home, LifeBuoy, Search } from "lucide-react";
import Link from "next/link";

import { BrandLogo } from "@/components/ui/logo";

/**
 * Root not-found boundary (used for URLs that match no route).
 * Group-level not-found pages render inside the public site layout.
 */
export default function RootNotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-sand px-6 py-16 text-center">
      <BrandLogo />
      <p className="mt-8 font-heading text-6xl text-cyprus">404</p>
      <h1 className="mt-3 text-2xl sm:text-3xl">This page could not be found</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The link may be broken or the page may have moved. Let&apos;s get you back
        on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyprus px-6 py-3 text-sm font-medium text-sand transition-colors hover:bg-cyprus-dark"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-cyprus/30 px-6 py-3 text-sm font-medium text-cyprus transition-colors hover:bg-cyprus/5"
        >
          <LifeBuoy className="h-4 w-4" />
          Contact us
        </Link>
      </div>
      <p className="mt-10 flex items-center gap-2 text-xs text-muted">
        <Search className="h-3.5 w-3.5" aria-hidden />
        Looking for a service or article? Try the Services or Resources pages.
      </p>
    </div>
  );
}
