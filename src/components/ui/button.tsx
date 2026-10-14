import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost" | "leaf";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-cyprus text-sand hover:bg-cyprus-dark hover:-translate-y-0.5 shadow-[0_10px_30px_-14px_rgba(0,71,65,0.7)]",
  secondary:
    "border border-cyprus/30 text-cyprus hover:border-cyprus hover:bg-cyprus/5 hover:-translate-y-0.5",
  light:
    "bg-sand text-cyprus hover:bg-white hover:-translate-y-0.5 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.5)]",
  leaf: "bg-leaf text-white hover:bg-leaf-dark hover:-translate-y-0.5",
  ghost: "text-cyprus hover:bg-cyprus/5",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-[0.95rem]",
  lg: "px-7 py-3.5 text-base",
};

interface ButtonBaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
  external?: boolean;
  ariaLabel?: string;
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  ariaLabel,
}: ButtonLinkProps) {
  const isProtocolLink = /^(https?:|mailto:|tel:)/.test(href);
  if (external || isProtocolLink) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        className={buttonClasses(variant, size, className)}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
