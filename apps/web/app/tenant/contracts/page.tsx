"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type Contract = {
  id: string;
  title: string;
  status: string;
  listing?: { title: string };
  landlord?: { fullName: string };
};

export default function TenantContractsPage() {
  const [rows, setRows] = useState<Contract[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get<Contract[]>("/contracts/mine/tenant");
        if (!c) setRows(data);
      } catch {
        if (!c) setError("Could not load contracts.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  const sign = async (id: string) => {
    setMsg("");
    setBusy(id);
    try {
      await api.post(`/contracts/${id}/sign`);
      setMsg("Signed successfully.");
      const { data } = await api.get<Contract[]>("/contracts/mine/tenant");
      setRows(data);
    } catch {
      setMsg("Could not sign contract.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <h1 className={shell.h1}>My contracts</h1>
      <p className={shell.lead}>Drafts awaiting your signature, and completed agreements.</p>
      {error ? <p className={shell.error}>{error}</p> : null}
      {msg ? <p className={shell.success}>{msg}</p> : null}
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
                    {c.listing?.title ?? "Listing"} · {c.status} · from{" "}
                    {c.landlord?.fullName ?? "landlord"}
                  </p>
                </div>
                {c.status === "draft" ? (
                  <button
                    type="button"
                    className={shell.btn}
                    disabled={busy === c.id}
                    onClick={() => sign(c.id)}
                  >
                    {busy === c.id ? "…" : "Sign"}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
