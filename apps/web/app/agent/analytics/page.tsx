import shell from "@/app/shell.module.css";
import { WorkspaceAnalyticsTabs } from "@/components/dashboard/WorkspaceAnalyticsTabs";

export default function AgentAnalyticsPage() {
  return (
    <>
      <h1 className={shell.h1}>Analytics</h1>
      <p className={shell.lead}>Pipeline, commissions, and territory performance.</p>
      <div className="mt-6">
        <WorkspaceAnalyticsTabs context="agent" />
      </div>
    </>
  );
}
