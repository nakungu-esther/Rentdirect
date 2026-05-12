import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  Globe2,
  Landmark,
  LayoutDashboard,
  LineChart,
  Map,
  MessageSquare,
  PieChart,
  Plus,
  Receipt,
  Scale,
  Search,
  Settings,
  Shield,
  Sparkles,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Demo badge for “enterprise” feel */
  badge?: number;
};

export type DashboardNavSection = {
  title: string;
  items: DashboardNavItem[];
};

export type DashboardVariant = "tenant" | "landlord" | "agent" | "government";

export const DASHBOARD_HOME: Record<DashboardVariant, string> = {
  tenant: "/tenant",
  landlord: "/landlord",
  agent: "/agent",
  government: "/government",
};

export const DASHBOARD_ROLE_LABEL: Record<DashboardVariant, string> = {
  tenant: "Tenant",
  landlord: "Landlord",
  agent: "Agent",
  government: "Government",
};

export const DASHBOARD_NAV: Record<DashboardVariant, DashboardNavSection[]> = {
  tenant: [
    {
      title: "",
      items: [
        { title: "Dashboard", href: "/tenant", icon: LayoutDashboard },
        { title: "Search properties", href: "/tenant/search", icon: Search },
        { title: "Saved properties", href: "/tenant/saved", icon: Building2 },
        { title: "Applications", href: "/tenant/applications", icon: FileText, badge: 2 },
        { title: "Lease contracts", href: "/tenant/contracts", icon: Scale },
        { title: "Payments", href: "/tenant/payments", icon: CreditCard },
        { title: "Wallet", href: "/tenant/wallet", icon: Wallet },
        { title: "Messages", href: "/tenant/messages", icon: MessageSquare, badge: 1 },
        { title: "Notifications", href: "/tenant/notifications", icon: Bell },
        { title: "Profile", href: "/tenant/profile", icon: UserCircle },
        { title: "Settings", href: "/tenant/settings", icon: Settings },
      ],
    },
  ],
  landlord: [
    {
      title: "",
      items: [
        { title: "Dashboard", href: "/landlord", icon: LayoutDashboard },
        { title: "Properties", href: "/landlord/listings", icon: Building2 },
        { title: "Add property", href: "/landlord/listings/new", icon: Plus },
        { title: "Applications", href: "/landlord/applications", icon: FileText },
        { title: "Tenants", href: "/landlord/tenants", icon: Users },
        { title: "Contracts", href: "/landlord/contracts", icon: Scale },
        { title: "Payments", href: "/landlord/payments", icon: CreditCard },
        { title: "Analytics", href: "/landlord/analytics", icon: LineChart },
        { title: "Reports", href: "/landlord/reports", icon: BarChart3 },
        { title: "Messages", href: "/landlord/messages", icon: MessageSquare },
        { title: "Notifications", href: "/landlord/notifications", icon: Bell },
        { title: "Wallet", href: "/landlord/wallet", icon: Wallet },
        { title: "Settings", href: "/landlord/settings", icon: Settings },
      ],
    },
  ],
  agent: [
    {
      title: "",
      items: [
        { title: "Dashboard", href: "/agent", icon: LayoutDashboard },
        { title: "Leads", href: "/agent/leads", icon: Sparkles, badge: 3 },
        { title: "Clients", href: "/agent/clients", icon: Users },
        { title: "Properties", href: "/agent/properties", icon: Building2 },
        { title: "Schedules", href: "/agent/schedules", icon: Calendar },
        { title: "Deals", href: "/agent/deals", icon: Briefcase },
        { title: "Commissions", href: "/agent/commissions", icon: Receipt },
        { title: "Analytics", href: "/agent/analytics", icon: LineChart },
        { title: "Messages", href: "/agent/messages", icon: MessageSquare },
        { title: "Notifications", href: "/agent/notifications", icon: Bell },
        { title: "Settings", href: "/agent/settings", icon: Settings },
      ],
    },
  ],
  government: [
    {
      title: "",
      items: [
        { title: "Overview", href: "/government", icon: LayoutDashboard },
        { title: "Housing analytics", href: "/government/housing", icon: PieChart },
        { title: "Occupancy reports", href: "/government/occupancy", icon: Activity },
        { title: "District trends", href: "/government/districts", icon: Map },
        { title: "Tax insights", href: "/government/tax", icon: Landmark },
        { title: "Compliance", href: "/government/compliance", icon: Shield },
        { title: "Urban planning", href: "/government/planning", icon: Globe2 },
        { title: "Reports", href: "/government/reports", icon: FileText },
        { title: "Notifications", href: "/government/notifications", icon: Bell },
        { title: "Settings", href: "/government/settings", icon: Settings },
      ],
    },
  ],
};

export function isDashboardNavActive(pathname: string, href: string): boolean {
  const roots = ["/tenant", "/landlord", "/agent", "/government"];
  if (roots.includes(href)) return pathname === href;
  if (href === "/tenant/search" && pathname.startsWith("/tenant/listings")) return true;
  if (href === "/landlord/listings") {
    if (pathname === "/landlord/listings") return true;
    if (pathname.startsWith("/landlord/listings/") && !pathname.startsWith("/landlord/listings/new")) {
      return true;
    }
    return false;
  }
  if (href === "/landlord/listings/new") {
    return pathname === "/landlord/listings/new" || pathname.startsWith("/landlord/listings/new/");
  }
  const paymentHubs = ["/tenant/payments", "/landlord/payments", "/admin/payments"];
  if (paymentHubs.includes(href) && pathname.startsWith(href)) return true;
  const messageHubs = ["/tenant/messages", "/landlord/messages", "/agent/messages"];
  if (messageHubs.includes(href) && pathname.startsWith(href)) return true;
  const settingsHubs = [
    "/tenant/settings",
    "/landlord/settings",
    "/agent/settings",
    "/government/settings",
  ];
  if (settingsHubs.includes(href) && pathname.startsWith(href)) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
