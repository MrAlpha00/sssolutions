import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  as: Tag = "div",
  interactive = false,
  surface = "cream",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
  interactive?: boolean;
  /** Background tone of the card. `sand` is used to separate grouped sections. */
  surface?: "cream" | "sand";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line p-6 shadow-[0_1px_2px_rgba(0,51,46,0.04)]",
        surface === "sand" ? "bg-sand" : "bg-cream",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-cyprus/25 hover:shadow-[0_24px_50px_-30px_rgba(0,51,46,0.45)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-sand px-3 py-1 text-xs font-medium text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line-dark bg-cream/60 px-6 py-12 text-center">
      <h3 className="text-lg text-cyprus">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
