import { SettingsHubShell } from "@/components/dashboard/WorkspaceHubLayouts";

export default function TenantSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsHubShell prefix="/tenant/settings">{children}</SettingsHubShell>;
}
