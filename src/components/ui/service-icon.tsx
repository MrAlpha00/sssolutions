import {
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  users: Users,
  wallet: Wallet,
  "shield-check": ShieldCheck,
  target: Target,
  "heart-handshake": HeartHandshake,
  "graduation-cap": GraduationCap,
};

export const serviceIconKeys = Object.keys(icons);

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? Users;
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
