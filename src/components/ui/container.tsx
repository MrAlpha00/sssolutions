import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

export function Section({
  children,
  className,
  id,
  as: Tag = "section",
  tone = "sand",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: ElementType;
  tone?: "sand" | "cream" | "cyprus" | "none";
}) {
  const tones: Record<string, string> = {
    sand: "bg-sand",
    cream: "bg-cream",
    cyprus: "bg-cyprus text-sand",
    none: "",
  };
  return (
    <Tag
      id={id}
      className={cn("scroll-mt-28 py-16 sm:py-20 lg:py-24", tones[tone], className)}
    >
      <Container>{children}</Container>
    </Tag>
  );
}
