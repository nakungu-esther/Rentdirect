/** Standard empty state for workspace routes until APIs are wired (dark glass shell). */
export function ModulePlaceholder({
  title,
  description = "This area is linked from your sidebar. Connect your NestJS modules here when ready.",
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-primary/20 bg-card/50 p-8 shadow-lg shadow-primary/10 backdrop-blur-xl">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
