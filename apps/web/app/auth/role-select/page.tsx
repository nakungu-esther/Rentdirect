"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Briefcase, Home } from "lucide-react";
import { authApi } from "@/lib/api";
import {
  getSessionUser,
  homePathForRole,
  patchSessionUser,
  type SessionUser,
} from "@/lib/session";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";

const ROLES: { value: SessionUser["role"]; label: string; hint: string; Icon: typeof Home }[] = [
  { value: "tenant", label: "Tenant", hint: "Rent and manage leases", Icon: Home },
  { value: "landlord", label: "Landlord", hint: "List properties and collect rent", Icon: Building2 },
  { value: "agent", label: "Agent", hint: "Leads, tours, commissions", Icon: Briefcase },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [current, setCurrent] = useState<SessionUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (u.role === "admin" || u.role === "government") {
      router.replace(homePathForRole(u.role));
      return;
    }
    setCurrent(u);
  }, [router]);

  const pick = async (role: SessionUser["role"]) => {
    if (!current) return;
    setError("");
    setLoading(role);
    try {
      await authApi.selectRole(role);
      patchSessionUser({ role });
      router.replace(homePathForRole(role));
    } catch {
      patchSessionUser({ role });
      router.replace(homePathForRole(role));
    } finally {
      setLoading(null);
    }
  };

  if (!current) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] text-sm text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <AuthSplitLayout
      heroKicker="Workspace"
      heroTitle="Choose your dashboard"
      heroLead="Switch how you use RentDirect for this session. When your API supports role changes, the selection syncs server-side; until then we update your local session."
      formTitle="Select role"
      formSubtitle="Admins and government users are assigned separately — this flow is for tenant, landlord, and agent workspaces."
      footerText="Wrong account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign out and log in"
    >
      <div className={styles.roleGrid}>
        {ROLES.map((r) => {
          const Icon = r.Icon;
          const active = current.role === r.value;
          return (
            <button
              key={r.value}
              type="button"
              disabled={Boolean(loading)}
              onClick={() => void pick(r.value)}
              className={`${styles.roleBtn} ${active ? styles.roleBtnActive : ""}`}
            >
              <div className={styles.roleBtnRow}>
                <span className={styles.roleBtnIcon}>
                  <Icon size={18} aria-hidden />
                </span>
                <div className={styles.roleBtnTextCol}>
                  <span className={styles.roleBtnTitle}>{r.label}</span>
                  <span className={styles.roleBtnHint}>{r.hint}</span>
                </div>
              </div>
              {loading === r.value ? (
                <span className="mt-2 text-xs font-semibold text-[#1b4332]">Opening…</span>
              ) : null}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </AuthSplitLayout>
  );
}
