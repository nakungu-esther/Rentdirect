import { PaymentHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function TenantPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaymentHubLayout prefix="/tenant/payments">{children}</PaymentHubLayout>;
}
