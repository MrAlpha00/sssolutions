import {
  Globe,
  GraduationCap,
  HeartHandshake,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  users: Users,
  wallet: Wallet,
  "shield-check": ShieldCheck,
  shield: Shield,
  target: Target,
  "heart-handshake": HeartHandshake,
  "graduation-cap": GraduationCap,
  globe: Globe,
  truck: Truck,
  sparkles: Sparkles,
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
