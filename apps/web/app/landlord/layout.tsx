import { AppShell } from "@/components/AppShell";
import { RoleGate } from "@/components/RoleGate";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["landlord"]}>
      <AppShell variant="landlord">{children}</AppShell>
    </RoleGate>
  );
}
