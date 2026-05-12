export enum ProductPhase {
  MVP = 'PHASE_1_MVP',
  PHASE_2 = 'PHASE_2',
  PHASE_3 = 'PHASE_3',
}

export enum Surface {
  TENANT_MOBILE = 'TENANT_MOBILE',
  LANDLORD_MOBILE = 'LANDLORD_MOBILE',
  AGENT_MOBILE = 'AGENT_MOBILE',
  ADMIN_WEB = 'ADMIN_WEB',
  GOVERNMENT_WEB = 'GOVERNMENT_WEB',
}

export type PlatformModuleDefinition = {
  key: string;
  name: string;
  phase: ProductPhase;
  surfaces: Surface[];
  notes?: string;
};

export const PLATFORM_MODULE_ROADMAP: PlatformModuleDefinition[] = [
  {
    key: 'auth',
    name: 'Auth',
    phase: ProductPhase.MVP,
    surfaces: [
      Surface.TENANT_MOBILE,
      Surface.LANDLORD_MOBILE,
      Surface.AGENT_MOBILE,
      Surface.ADMIN_WEB,
      Surface.GOVERNMENT_WEB,
    ],
    notes: 'Identity, OTP, JWT, refresh tokens, roles, sessions, verification status.',
  },
  {
    key: 'users',
    name: 'Users',
    phase: ProductPhase.MVP,
    surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.AGENT_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB],
  },
  { key: 'listings', name: 'Listings', phase: ProductPhase.MVP, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
  { key: 'uploads', name: 'Files & Uploads', phase: ProductPhase.MVP, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.AGENT_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
  { key: 'payments', name: 'Payments', phase: ProductPhase.MVP, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
  { key: 'notifications', name: 'Notifications', phase: ProductPhase.MVP, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.AGENT_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },

  { key: 'rentals', name: 'Rent Management', phase: ProductPhase.PHASE_2, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.ADMIN_WEB] },
  { key: 'contracts', name: 'Rental Contracts', phase: ProductPhase.PHASE_2, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
  { key: 'messaging', name: 'Chat / Messaging', phase: ProductPhase.PHASE_2, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.AGENT_MOBILE, Surface.ADMIN_WEB] },
  { key: 'admin_dashboard', name: 'Admin Dashboard Expansion', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB] },

  { key: 'government_integrations', name: 'Government Integrations', phase: ProductPhase.PHASE_3, surfaces: [Surface.GOVERNMENT_WEB, Surface.ADMIN_WEB] },
  { key: 'ai', name: 'AI Recommendations', phase: ProductPhase.PHASE_3, surfaces: [Surface.TENANT_MOBILE, Surface.ADMIN_WEB] },
  { key: 'blockchain', name: 'Blockchain Trust Layer', phase: ProductPhase.PHASE_3, surfaces: [Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
  { key: 'smart_city_analytics', name: 'Smart-city Analytics', phase: ProductPhase.PHASE_3, surfaces: [Surface.GOVERNMENT_WEB, Surface.ADMIN_WEB] },

  { key: 'location_map', name: 'Location & Map', phase: ProductPhase.PHASE_2, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.GOVERNMENT_WEB] },
  { key: 'analytics', name: 'Analytics', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB, Surface.LANDLORD_MOBILE] },
  { key: 'moderation', name: 'Moderation', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB] },
  { key: 'reporting', name: 'Reporting', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB, Surface.LANDLORD_MOBILE] },
  { key: 'settings', name: 'System Settings', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB] },
  { key: 'support', name: 'Support & Tickets', phase: ProductPhase.PHASE_2, surfaces: [Surface.TENANT_MOBILE, Surface.LANDLORD_MOBILE, Surface.ADMIN_WEB] },
  { key: 'audit_logs', name: 'Audit Logs', phase: ProductPhase.PHASE_2, surfaces: [Surface.ADMIN_WEB, Surface.GOVERNMENT_WEB] },
];
