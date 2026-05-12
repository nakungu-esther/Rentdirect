import { SettingsHubShell } from "@/components/dashboard/WorkspaceHubLayouts";

export default function AgentSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsHubShell prefix="/agent/settings">{children}</SettingsHubShell>;
}
