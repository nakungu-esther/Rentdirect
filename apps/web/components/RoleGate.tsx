"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSessionUser } from "@/lib/session";

export function RoleGate({
  allow,
  children,
}: {
  allow: string[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const u = getSessionUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (!allow.includes(u.role)) {
      router.replace("/");
      return;
    }
    setOk(true);
  }, [allow, router]);

  if (!ok) {
    return (
      <p style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
        Checking session…
      </p>
    );
  }

  return <>{children}</>;
}
