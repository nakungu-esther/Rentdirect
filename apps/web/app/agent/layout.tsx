import { AppShell } from "@/components/AppShell";
import { RoleGate } from "@/components/RoleGate";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["agent"]}>
      <AppShell variant="agent">{children}</AppShell>
    </RoleGate>
  );
}
