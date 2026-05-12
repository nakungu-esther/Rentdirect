import { api } from "@/lib/api";

export const ADMIN_HEALTH_PATHS = [
  { label: "Auth", path: "/auth/health" },
  { label: "Users", path: "/users/health" },
  { label: "Contracts", path: "/contracts/health" },
  { label: "Blockchain", path: "/blockchain/health" },
  { label: "Analytics", path: "/analytics/health" },
  { label: "Moderation", path: "/moderation/health" },
  { label: "Audit logs", path: "/audit-logs/health" },
  { label: "Support", path: "/support/health" },
  { label: "Settings", path: "/settings/health" },
  { label: "Reporting", path: "/reporting/health" },
  { label: "AI", path: "/ai/health" },
] as const;

export type HealthRow = { label: string; ok: boolean; detail: string };

export async function fetchAdminHealth(): Promise<HealthRow[]> {
  return Promise.all(
    ADMIN_HEALTH_PATHS.map(async ({ label, path }) => {
      try {
        const { data } = await api.get<unknown>(path);
        const detail = JSON.stringify(data).slice(0, 160);
        return { label, ok: true, detail };
      } catch {
        return { label, ok: false, detail: "unreachable" };
      }
    }),
  );
}
