import {
  DEFAULT_SERVICE_GROUP,
  isServiceGroup,
  type Service,
  type ServiceGroup,
} from "@/lib/types";

/**
 * Public grouping of the service catalogue.
 *
 * The website presents two clearly separated sections — the core HR services
 * and the additional business & workforce support services. The section copy
 * lives here (not in the page component) so both the homepage preview and the
 * full services page stay in sync.
 */
export interface ServiceSection {
  group: ServiceGroup;
  title: string;
  description: string;
}

export const serviceSections: ServiceSection[] = [
  {
    group: "hr",
    title: "Human Resources Solutions",
    description:
      "People-focused HR services that help organizations build, support, and develop stronger teams.",
  },
  {
    group: "business",
    title: "Business & Workforce Support Services",
    description:
      "Practical services designed to support everyday business operations and workforce needs.",
  },
];

export const serviceGroupLabels: Record<ServiceGroup, string> = {
  hr: "Human Resources Solutions",
  business: "Business & Workforce Support Services",
};

/** Short label used in the admin dashboard list. */
export const serviceGroupShortLabels: Record<ServiceGroup, string> = {
  hr: "HR services",
  business: "Business services",
};

/** Coerce anything into a valid group, defaulting to the core HR group. */
export function normalizeServiceGroup(value: unknown): ServiceGroup {
  return isServiceGroup(value) ? value : DEFAULT_SERVICE_GROUP;
}

/**
 * Split a flat list of services into the two public groups, preserving the
 * incoming order (which is the stored display order) inside each group.
 */
export function groupServices(
  services: Service[],
): Record<ServiceGroup, Service[]> {
  const grouped: Record<ServiceGroup, Service[]> = { hr: [], business: [] };
  for (const service of services) {
    grouped[normalizeServiceGroup(service.group)].push(service);
  }
  return grouped;
}
