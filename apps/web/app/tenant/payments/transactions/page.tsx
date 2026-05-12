"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type Payment = {
  id: string;
  amountUGX: string | number;
  status: string;
  provider: string;
  createdAt: string;
  listing?: { id: string; title: string };
};

export default function TenantPaymentTransactionsPage() {
  const [rows, setRows] = useState<Payment[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get<Payment[]>("/payments/my");
        if (!c) setRows(data);
      } catch {
        if (!c) setError("Could not load payments.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <>
      <h1 className={shell.h1}>Transactions</h1>
      <p className={shell.lead}>
        <Link href="/tenant/payments/new">+ New payment</Link>
      </p>
      {error ? <p className={shell.error}>{error}</p> : null}
      {!rows ? (
        <p className={shell.muted}>Loading…</p>
      ) : (
        <div className={shell.card}>
          {rows.length === 0 ? (
            <p className={shell.muted}>No payments yet.</p>
          ) : (
            rows.map((p) => (
              <div key={p.id} className={shell.row}>
                <div>
                  <strong>{p.listing?.title ?? "Listing"}</strong>
                  <p className={shell.muted}>
                    {p.provider} · {p.status}
                  </p>
                </div>
                <div style={{ fontWeight: 700 }}>UGX {Number(p.amountUGX).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
