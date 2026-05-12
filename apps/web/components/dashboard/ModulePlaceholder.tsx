/** Standard empty state for workspace routes until APIs are wired (dark glass shell). */
export function ModulePlaceholder({
  title,
  description = "This area is linked from your sidebar. Connect your NestJS modules here when ready.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#1F2937]/85 p-8 shadow-xl shadow-black/30 backdrop-blur-xl">
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}