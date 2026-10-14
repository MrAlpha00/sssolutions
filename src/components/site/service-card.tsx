import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { ServiceIcon } from "@/components/ui/service-icon";
import type { Service } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Service summary card used on the homepage and the services index. */
export function ServiceCard({
  service,
  className,
}: {
  service: Service;
  className?: string;
}) {
  return (
    <Card as="article" interactive className={cn("group flex h-full flex-col", className)}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyprus/8 text-cyprus">
        <ServiceIcon name={service.icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg leading-snug">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {service.summary}
      </p>
      <Link
        href={`/services/${service.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyprus"
      >
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        <span className="sr-only"> about {service.title}</span>
      </Link>
    </Card>
  );
}
