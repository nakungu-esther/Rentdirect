import { MessagesHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function LandlordMessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagesHubLayout prefix="/landlord/messages">{children}</MessagesHubLayout>;
}
