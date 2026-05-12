import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  LineChart,
  Scale,
  ScrollText,
  Settings,
  Shield,
  ShieldAlert,
  Headphones,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

/** Control center sidebar — order matches product IA. */
export const ADMIN_NAV: AdminNavItem[] = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Listings", href: "/admin/listings", icon: Building2 },
  { title: "Moderation", href: "/admin/moderation", icon: ShieldAlert, badge: 1 },
  { title: "Payments", href: "/admin/payments", icon: CreditCard },
  { title: "Contracts", href: "/admin/contracts", icon: Scale },
  { title: "Fraud Detection", href: "/admin/fraud", icon: Shield },
  { title: "Analytics", href: "/admin/analytics", icon: LineChart },
  { title: "Reports", href: "/admin/reports", icon: FileBarChart },
  { title: "Support", href: "/admin/support", icon: Headphones },
  { title: "Audit Logs", href: "/admin/audit", icon: ScrollText },
  { title: "System Settings", href: "/admin/settings", icon: Settings },
];
