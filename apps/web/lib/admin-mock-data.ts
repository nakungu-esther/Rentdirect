export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  status: "active" | "invited" | "suspended";
  lastActive: string;
};

export const DEMO_ADMIN_USERS: AdminUserRow[] = [
  {
    id: "1",
    fullName: "Asha Namukasa",
    email: "asha@example.com",
    role: "tenant",
    status: "active",
    lastActive: "2 min ago",
  },
  {
    id: "2",
    fullName: "Peter Okello",
    email: "peter@example.com",
    role: "landlord",
    status: "active",
    lastActive: "18 min ago",
  },
  {
    id: "3",
    fullName: "RentDirect Ops",
    email: "ops@rentdirect.ug",
    role: "admin",
    status: "active",
    lastActive: "Just now",
  },
  {
    id: "4",
    fullName: "James Ssemakula",
    email: "james@example.com",
    role: "agent",
    status: "invited",
    lastActive: "—",
  },
  {
    id: "5",
    fullName: "Mary Akello",
    email: "mary@example.com",
    role: "tenant",
    status: "suspended",
    lastActive: "3 days ago",
  },
];

export type AdminPaymentRow = {
  id: string;
  reference: string;
  payer: string;
  amountUGX: number;
  provider: string;
  status: "settled" | "pending" | "failed" | "flagged";
  created: string;
};

export const ROLE_MIX_CHART = [
  { name: "Tenants", value: 620 },
  { name: "Landlords", value: 210 },
  { name: "Agents", value: 54 },
  { name: "Ops", value: 12 },
];

export const REPORTS_TREND = [
  { week: "W1", signups: 120, verifications: 92 },
  { week: "W2", signups: 142, verifications: 108 },
  { week: "W3", signups: 138, verifications: 101 },
  { week: "W4", signups: 165, verifications: 130 },
  { week: "W5", signups: 188, verifications: 151 },
  { week: "W6", signups: 201, verifications: 162 },
];

export const DEMO_ADMIN_PAYMENTS: AdminPaymentRow[] = [
  {
    id: "p1",
    reference: "RD-92831",
    payer: "Asha N.",
    amountUGX: 1_850_000,
    provider: "MTN MoMo",
    status: "settled",
    created: "Today · 09:14",
  },
  {
    id: "p2",
    reference: "RD-92802",
    payer: "Peter O.",
    amountUGX: 2_200_000,
    provider: "Airtel Money",
    status: "pending",
    created: "Today · 08:51",
  },
  {
    id: "p3",
    reference: "RD-92788",
    payer: "Mary A.",
    amountUGX: 950_000,
    provider: "MTN MoMo",
    status: "flagged",
    created: "Yesterday · 21:03",
  },
  {
    id: "p4",
    reference: "RD-92740",
    payer: "Corporate lease",
    amountUGX: 12_400_000,
    provider: "Bank transfer",
    status: "settled",
    created: "Yesterday · 14:22",
  },
  {
    id: "p5",
    reference: "RD-92712",
    payer: "James S.",
    amountUGX: 600_000,
    provider: "MTN MoMo",
    status: "failed",
    created: "Mon · 11:08",
  },
];
