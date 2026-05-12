import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

export default function AdminNotificationsPage() {
  return (
    <>
      <AdminPageHeader
        title="Notification center"
        description="Platform-wide alerts, SLA breaches, and delivery webhooks. Fraud and system classes surface in the type filters below."
      />
      <NotificationCenter intro="Cross-cutting alerts for operators. Connect your event bus to replace the empty state." />
    </>
  );
}
