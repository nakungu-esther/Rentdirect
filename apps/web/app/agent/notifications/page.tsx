import { NotificationCenter } from "@/components/dashboard/NotificationCenter";
import shell from "@/app/shell.module.css";

export default function AgentNotificationsPage() {
  return (
    <>
      <h1 className={shell.h1}>Notification center</h1>
      <div className="mt-6">
        <NotificationCenter />
      </div>
    </>
  );
}
