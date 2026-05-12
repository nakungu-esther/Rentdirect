import { AppShell } from "@/components/AppShell";
import { RoleGate } from "@/components/RoleGate";

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["government"]}>
      <AppShell variant="government">{children}</AppShell>
    </RoleGate>
  );
}
