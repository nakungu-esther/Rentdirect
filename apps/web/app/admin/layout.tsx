import { AdminShell } from "@/components/admin/admin-shell";
import { RoleGate } from "@/components/RoleGate";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGate allow={["admin"]}>
      <TooltipProvider delayDuration={200}>
        <AdminShell>{children}</AdminShell>
      </TooltipProvider>
    </RoleGate>
  );
}
