import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Post } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

/** Article preview card for the resources index and homepage. */
export function ResourceCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  return (
    <Card as="article" interactive className={cn("group flex h-full flex-col", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf-dark">
        {post.category}
      </p>
      <h3 className="mt-3 text-lg leading-snug">
        <Link href={`/resources/${post.slug}`} className="hover:text-cyprus-dark">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.summary}</p>
      <div className="mt-5 flex items-center justify-between gap-4 text-xs text-muted">
        <time dateTime={post.published_at ?? post.created_at}>
          {formatDate(post.published_at ?? post.created_at)}
        </time>
        <Link
          href={`/resources/${post.slug}`}
          className="inline-flex items-center gap-1.5 font-medium text-cyprus"
          aria-hidden
          tabIndex={-1}
        >
          Read
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Card>
  );
}
