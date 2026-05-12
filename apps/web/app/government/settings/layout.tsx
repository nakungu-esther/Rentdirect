import { SettingsHubShell } from "@/components/dashboard/WorkspaceHubLayouts";

export default function GovernmentSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsHubShell prefix="/government/settings">{children}</SettingsHubShell>;
}
