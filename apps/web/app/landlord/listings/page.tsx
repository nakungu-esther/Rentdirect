"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type Listing = {
  id: string;
  title: string;
  location: string;
  priceUGX: string | number;
  status: string;
};

export default function LandlordListingsPage() {
  const [rows, setRows] = useState<Listing[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data } = await api.get<Listing[]>("/listings/mine");
        if (!c) setRows(data);
      } catch {
        if (!c) setError("Could not load your listings.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <>
      <h1 className={shell.h1}>My listings</h1>
      <p className={shell.lead}>
        <Link href="/landlord/listings/new">+ New listing</Link>
      </p>
      {error ? <p className={shell.error}>{error}</p> : null}
      {!rows ? (
        <p className={shell.muted}>Loading…</p>
      ) : (
        <div className={shell.card}>
          {rows.length === 0 ? (
            <p className={shell.muted}>You have no listings yet.</p>
          ) : (
            rows.map((l) => (
              <div key={l.id} className={shell.row}>
                <div>
                  <Link href={`/landlord/listings/${l.id}`} style={{ fontWeight: 700 }}>
                    {l.title}
                  </Link>
                  <p className={shell.muted}>
                    {l.location} · {l.status}
                  </p>
                </div>
                <div style={{ fontWeight: 700 }}>
                  UGX {Number(l.priceUGX).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
