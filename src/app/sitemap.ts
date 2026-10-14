import type { MetadataRoute } from "next";

import { getPosts, getServices } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/** XML sitemap. Generated from the same store the admin dashboard writes to. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([getServices(), getPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/resources"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/careers"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/terms"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: service.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/resources/${post.slug}`),
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
