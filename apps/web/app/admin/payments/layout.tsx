import { PaymentHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function AdminPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaymentHubLayout prefix="/admin/payments">{children}</PaymentHubLayout>;
}
