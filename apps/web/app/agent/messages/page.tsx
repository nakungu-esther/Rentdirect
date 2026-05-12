import { redirect } from "next/navigation";

export default function AgentMessagesIndexPage() {
  redirect("/agent/messages/inbox");
}
