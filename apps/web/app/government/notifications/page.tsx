import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

export default function GovernmentNotificationsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-slate-50">Notification center</h1>
      <div className="mt-6">
        <NotificationCenter intro="Policy, compliance, and data-ingest alerts for government users." />
      </div>
    </>
  );
}
