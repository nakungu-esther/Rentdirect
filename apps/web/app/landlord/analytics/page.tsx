import shell from "@/app/shell.module.css";
import { WorkspaceAnalyticsTabs } from "@/components/dashboard/WorkspaceAnalyticsTabs";

export default function LandlordAnalyticsPage() {
  return (
    <>
      <h1 className={shell.h1}>Analytics</h1>
      <p className={shell.lead}>Portfolio performance and market context.</p>
      <div className="mt-6">
        <WorkspaceAnalyticsTabs context="landlord" />
      </div>
    </>
  );
}
