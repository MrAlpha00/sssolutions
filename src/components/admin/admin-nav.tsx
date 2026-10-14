"use client";

import {
  Briefcase,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Quote,
  Settings,
  UserRoundPlus,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/partners", label: "Clients & Partners", icon: Building2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/resources", label: "Resources", icon: FileText },
  { href: "/admin/jobs", label: "Job openings", icon: UserRoundPlus },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/applications", label: "Applications", icon: UserRoundPlus },
  { href: "/admin/settings", label: "Website settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-cyprus text-sand"
                : "text-ink/75 hover:bg-cyprus/5 hover:text-cyprus",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden strokeWidth={1.9} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
