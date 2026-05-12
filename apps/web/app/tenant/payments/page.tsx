import { redirect } from "next/navigation";

export default function TenantPaymentsIndexPage() {
  redirect("/tenant/payments/transactions");
}
