import { PaymentHubLayout } from "@/components/dashboard/WorkspaceHubLayouts";

export default function LandlordPaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PaymentHubLayout prefix="/landlord/payments">{children}</PaymentHubLayout>;
}
