"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

const PROVIDERS = [
  { value: "mtn_momo", label: "MTN MoMo" },
  { value: "airtel", label: "Airtel Money" },
  { value: "visa", label: "Visa" },
];

export default function NewPaymentPage() {
  const router = useRouter();
  const [listingId, setListingId] = useState("");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setListingId(q.get("listingId") ?? "");
  }, []);
  const [amountUGX, setAmount] = useState("");
  const [provider, setProvider] = useState("mtn_momo");
  const [phoneNumber, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/payments/initiate", {
        listingId: listingId.trim(),
        amountUGX: Number(amountUGX),
        provider,
        phoneNumber: phoneNumber.trim(),
      });
      router.push("/tenant/payments");
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { message?: unknown } } })
        ?.response?.data?.message;
      setError(
        Array.isArray(d) ? d.join(", ") : String(d ?? "Payment failed."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={shell.h1}>Initiate payment</h1>
      <p className={shell.lead}>
        <Link href="/tenant/payments">← Back</Link>
      </p>
      <form className={shell.card} onSubmit={submit}>
        <label className={shell.label}>
          Listing ID (UUID)
          <input
            className={shell.input}
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Amount (UGX)
          <input
            className={shell.input}
            type="number"
            min={1000}
            value={amountUGX}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Provider
          <select
            className={shell.select}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className={shell.label}>
          Phone (+256XXXXXXXXX)
          <input
            className={shell.input}
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="+256700123456"
          />
        </label>
        {error ? <p className={shell.error}>{error}</p> : null}
        <button
          type="submit"
          className={shell.btn}
          style={{ marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Submitting…" : "Initiate"}
        </button>
      </form>
    </>
  );
}
