"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

type ListingDetail = {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  priceUGX: string | number;
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  landlord?: { id: string; fullName: string; phone: string };
};

export default function ListingDetailPage() {
  const params = useParams();
  const id = String(params.id ?? "");
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get<ListingDetail>(`/listings/${id}`);
        if (!cancelled) setListing(data);
      } catch {
        if (!cancelled) setError("Listing not found or API unavailable.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <>
        <p className={shell.error}>{error}</p>
        <Link href="/listings" className={shell.muted}>
          ← Back
        </Link>
      </>
    );
  }

  if (!listing) {
    return <p className={shell.lead}>Loading…</p>;
  }

  return (
    <>
      <Link href="/listings" className={shell.muted}>
        ← All listings
      </Link>
      <h1 className={shell.h1} style={{ marginTop: 12 }}>
        {listing.title}
      </h1>
      <p className={shell.lead}>
        {listing.location} · {listing.address}
      </p>
      <p style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 16 }}>
        UGX {Number(listing.priceUGX).toLocaleString()} / mo
      </p>
      <div className={shell.card}>
        <p style={{ lineHeight: 1.6 }}>{listing.description}</p>
        <p className={shell.muted} style={{ marginTop: 12 }}>
          {listing.propertyType} · {listing.bedrooms ?? 0} bed ·{" "}
          {listing.bathrooms ?? 0} bath
        </p>
        {listing.landlord ? (
          <p className={shell.muted} style={{ marginTop: 8 }}>
            Listed by {listing.landlord.fullName}
          </p>
        ) : null}
      </div>
      <p className={shell.lead} style={{ marginTop: 16 }}>
        <Link href={`/tenant/payments/new?listingId=${listing.id}`}>
          Initiate payment (tenant) →
        </Link>
      </p>
    </>
  );
}
