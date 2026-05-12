"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type ListingRow = {
  id: string;
  title: string;
  location: string;
  priceUGX: string | number;
  propertyType: string;
  bedrooms?: number;
};

type PageData = {
  data: ListingRow[];
  total: number;
  page: number;
  pages: number;
};

export default function ListingsBrowsePage() {
  const [res, setRes] = useState<PageData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<PageData>("/listings", {
          params: { page: 1, limit: 30 },
        });
        if (!cancelled) setRes(data);
      } catch {
        if (!cancelled) setError("Could not load listings. Is the API running?");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <>
        <h1 className={shell.h1}>Listings</h1>
        <p className={shell.error}>{error}</p>
      </>
    );
  }

  if (!res) {
    return <p className={shell.lead}>Loading listings…</p>;
  }

  return (
    <>
      <h1 className={shell.h1}>Browse listings</h1>
      <p className={shell.lead}>
        {res.total} active listing{res.total === 1 ? "" : "s"} (page {res.page} of{" "}
        {res.pages}).
      </p>
      <div className={shell.card}>
        {res.data.length === 0 ? (
          <p className={shell.muted}>No listings yet.</p>
        ) : (
          res.data.map((l) => (
            <div key={l.id} className={shell.row}>
              <div>
                <Link href={`/listings/${l.id}`} style={{ fontWeight: 700 }}>
                  {l.title}
                </Link>
                <p className={shell.muted}>
                  {l.location} · {l.propertyType} ·{" "}
                  {l.bedrooms != null ? `${l.bedrooms} bed` : ""}
                </p>
              </div>
              <div style={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                UGX {Number(l.priceUGX).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
