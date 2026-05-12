"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type Contract = {
  id: string;
  title: string;
  status: string;
  listing?: { title: string };
  tenant?: { fullName: string; email: string };
};

export default function LandlordContractsPage() {
  const [rows, setRows] = useState<Contract[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get<Contract[]>("/contracts/mine/landlord");
        if (!c) setRows(data);
      } catch {
        if (!c) setError("Could not load contracts.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <>
      <h1 className={shell.h1}>Contracts</h1>
      <p className={shell.lead}>
        <Link href="/landlord/contracts/new">+ New contract</Link>
      </p>
      {error ? <p className={shell.error}>{error}</p> : null}
      {!rows ? (
        <p className={shell.muted}>Loading…</p>
      ) : (
        <div className={shell.card}>
          {rows.length === 0 ? (
            <p className={shell.muted}>No contracts yet.</p>
          ) : (
            rows.map((c) => (
              <div key={c.id} className={shell.row}>
                <div>
                  <strong>{c.title}</strong>
                  <p className={shell.muted}>
                    {c.listing?.title ?? "Listing"} · Tenant:{" "}
                    {c.tenant?.fullName ?? c.tenant?.email ?? "—"} · {c.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
