import { MessagesHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function AgentMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesHubLayout prefix="/agent/messages">{children}</MessagesHubLayout>;
}
