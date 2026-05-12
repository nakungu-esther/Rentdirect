export type AccountRole = 'tenant' | 'landlord' | 'agent';

export type RoleDefinition = {
  role: AccountRole;
  title: string;
  headline: string;
  description: string;
  icon: 'home' | 'business' | 'people';
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'tenant',
    title: 'Tenant',
    headline: 'Find & lease with confidence',
    description:
      'Browse verified homes, pay rent securely, and manage contracts in one calm workspace.',
    icon: 'home',
  },
  {
    role: 'landlord',
    title: 'Landlord',
    headline: 'Operate your portfolio',
    description:
      'Publish inventory, track occupancy, and collect settlements with enterprise-grade controls.',
    icon: 'business',
  },
  {
    role: 'agent',
    title: 'Agent',
    headline: 'Represent clients at scale',
    description:
      'Coordinate viewings, listings, and paperwork with tools built for trusted intermediaries.',
    icon: 'people',
  },
];

export function isAccountRole(v: string | undefined): v is AccountRole {
  return v === 'tenant' || v === 'landlord' || v === 'agent';
}
