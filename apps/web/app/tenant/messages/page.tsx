import { redirect } from "next/navigation";

export default function TenantMessagesIndexPage() {
  redirect("/tenant/messages/inbox");
}
