import { notFound } from "next/navigation";
import { ModulePlaceholder } from "@/components/dashboard/ModulePlaceholder";
import { SETTINGS_HUB_LINKS, SETTINGS_SECTION_SLUGS } from "@/components/dashboard/hub-links";

export function SettingsSectionView({ section }: { section: string }) {
  if (!(SETTINGS_SECTION_SLUGS as readonly string[]).includes(section)) {
    notFound();
  }
  const label = SETTINGS_HUB_LINKS.find((l) => l.suffix === `/${section}`)?.label ?? section;

  if (section === "api-keys") {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-[#1F2937]/85 p-8 shadow-xl shadow-black/30 backdrop-blur-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white">{label}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Issue scoped keys for integrations and automation. Keys are shown once at creation — store
          them in a secrets manager. Connect your NestJS gateway to mint and revoke keys.
        </p>
        <div className="mt-6 rounded-xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center text-sm text-slate-500">
          No keys yet. When the API is ready, add a &quot;Create key&quot; action here with role-based
          scopes (read listings, write payments, admin.read).
        </div>
      </div>
    );
  }

  return (
    <ModulePlaceholder
      title={label}
      description="Account preferences and security controls will persist here once wired to your user API."
    />
  );
}