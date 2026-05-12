export type OnboardingSlide = {
  id: string;
  title: string;
  subtitle: string;
  /** Maps to illustration variant */
  visual: 'trusted' | 'blockchain' | 'contracts';
};

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Trusted Rentals',
    subtitle:
      'Verified landlords, transparent pricing, and inventory you can trust across Uganda.',
    visual: 'trusted',
  },
  {
    id: '2',
    title: 'Blockchain Payments',
    subtitle:
      'Immutable settlement rails and auditable payment history designed for institutional-grade trust.',
    visual: 'blockchain',
  },
  {
    id: '3',
    title: 'Smart Contracts',
    subtitle:
      'Digital leases with structured obligations, reminders, and signatures that keep everyone aligned.',
    visual: 'contracts',
  },
];
