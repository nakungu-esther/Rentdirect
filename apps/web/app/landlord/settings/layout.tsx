import { SettingsHubShell } from "@/components/dashboard/WorkspaceHubLayouts";

export default function LandlordSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsHubShell prefix="/landlord/settings">{children}</SettingsHubShell>;
}
