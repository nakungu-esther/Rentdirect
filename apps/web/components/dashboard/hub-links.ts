/** Shared hub nav metadata (safe to import from server components). */

export const PAYMENT_HUB_LINKS: { suffix: string; label: string }[] = [
  { suffix: "/transactions", label: "Transactions" },
  { suffix: "/invoices", label: "Invoices" },
  { suffix: "/escrow", label: "Escrow" },
  { suffix: "/wallet", label: "Wallet" },
  { suffix: "/withdrawals", label: "Withdrawals" },
  { suffix: "/refunds", label: "Refunds" },
  { suffix: "/blockchain-receipts", label: "Blockchain receipts" },
];

export const MESSAGES_HUB_LINKS: { suffix: string; label: string }[] = [
  { suffix: "/inbox", label: "Inbox" },
  { suffix: "/unread", label: "Unread" },
  { suffix: "/starred", label: "Starred" },
  { suffix: "/archived", label: "Archived" },
  { suffix: "/support", label: "Support" },
];

export const MESSAGE_SECTION_SLUGS = MESSAGES_HUB_LINKS.map((l) =>
  l.suffix.replace(/^\//, ""),
) as readonly string[];

export const SETTINGS_HUB_LINKS: { suffix: string; label: string }[] = [
  { suffix: "/profile", label: "Profile" },
  { suffix: "/security", label: "Security" },
  { suffix: "/2fa", label: "2FA" },
  { suffix: "/notifications", label: "Notifications" },
  { suffix: "/wallet", label: "Wallet" },
  { suffix: "/billing", label: "Billing" },
  { suffix: "/appearance", label: "Appearance" },
  { suffix: "/privacy", label: "Privacy" },
  { suffix: "/language", label: "Language" },
  { suffix: "/api-keys", label: "API keys" },
];

export const SETTINGS_SECTION_SLUGS = SETTINGS_HUB_LINKS.map((l) =>
  l.suffix.replace(/^\//, ""),
) as readonly string[];
