import { MessagesHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function TenantMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesHubLayout prefix="/tenant/messages">{children}</MessagesHubLayout>;
}
