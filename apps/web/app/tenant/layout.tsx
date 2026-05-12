import { AppShell } from "@/components/AppShell";
import { RoleGate } from "@/components/RoleGate";

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["tenant"]}>
      <AppShell variant="tenant">{children}</AppShell>
    </RoleGate>
  );
}
