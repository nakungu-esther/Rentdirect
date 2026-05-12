import { PublicChrome } from "@/components/PublicChrome";

export default function AboutPage() {
  return (
    <PublicChrome>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">About RentDirect UG</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        RentDirect is a multi-role rental platform for Uganda — combining listings, contracts,
        payments, and oversight in one professional stack.
      </p>
    </PublicChrome>
  );
}
