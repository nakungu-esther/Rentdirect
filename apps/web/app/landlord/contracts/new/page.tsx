"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

export default function NewContractPage() {
  const router = useRouter();
  const [listingId, setListingId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [title, setTitle] = useState("Rental agreement");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/contracts", {
        listingId: listingId.trim(),
        tenantId: tenantId.trim(),
        title: title.trim(),
        body: body.trim() || undefined,
      });
      router.push("/landlord/contracts");
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { message?: unknown } } })
        ?.response?.data?.message;
      setError(Array.isArray(d) ? d.join(", ") : String(d ?? "Failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={shell.h1}>New contract</h1>
      <p className={shell.lead}>
        <Link href="/landlord/contracts">← Back</Link>
      </p>
      <form className={shell.card} onSubmit={submit}>
        <label className={shell.label}>
          Listing ID
          <input
            className={shell.input}
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Tenant user ID (UUID)
          <input
            className={shell.input}
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Title
          <input
            className={shell.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Terms (optional)
          <textarea
            className={shell.textarea}
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        {error ? <p className={shell.error}>{error}</p> : null}
        <button
          type="submit"
          className={shell.btn}
          style={{ marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Creating…" : "Create draft"}
        </button>
      </form>
    </>
  );
}
