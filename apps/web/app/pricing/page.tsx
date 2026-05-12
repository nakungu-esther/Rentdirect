import { PublicChrome } from "@/components/PublicChrome";

export default function PricingPage() {
  return (
    <PublicChrome>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pricing</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Plans for tenants, landlords, and agents will appear here. For hackathon demos, focus on
        the core rental and payment journey first.
      </p>
    </PublicChrome>
  );
}
