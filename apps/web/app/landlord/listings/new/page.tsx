"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

const PROPERTY_TYPES = [
  "apartment",
  "house",
  "room",
  "commercial",
  "land",
] as const;

export default function NewListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] =
    useState<(typeof PROPERTY_TYPES)[number]>("apartment");
  const [priceUGX, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("2");
  const [bathrooms, setBathrooms] = useState("1");
  const [amenities, setAmenities] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const amenList = amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await api.post("/listings", {
        title: title.trim(),
        description: description.trim(),
        propertyType,
        priceUGX: Number(priceUGX),
        location: location.trim(),
        address: address.trim(),
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        isFurnished: false,
        amenities: amenList.length ? amenList : undefined,
      });
      router.push("/landlord/listings");
    } catch (err: unknown) {
      const d = (err as { response?: { data?: { message?: unknown } } })
        ?.response?.data?.message;
      setError(Array.isArray(d) ? d.join(", ") : String(d ?? "Save failed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className={shell.h1}>New listing</h1>
      <p className={shell.lead}>
        <Link href="/landlord/listings">← Back</Link>
      </p>
      <form className={shell.card} onSubmit={submit}>
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
          Description
          <textarea
            className={shell.textarea}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Property type
          <select
            className={shell.select}
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value as (typeof PROPERTY_TYPES)[number])
            }
          >
            {PROPERTY_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className={shell.label}>
          Monthly rent (UGX)
          <input
            className={shell.input}
            type="number"
            min={0}
            value={priceUGX}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          District / area
          <input
            className={shell.input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Street address
          <input
            className={shell.input}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label className={shell.label}>
          Bedrooms
          <input
            className={shell.input}
            type="number"
            min={0}
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
          />
        </label>
        <label className={shell.label}>
          Bathrooms
          <input
            className={shell.input}
            type="number"
            min={0}
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
          />
        </label>
        <label className={shell.label}>
          Amenities (comma-separated)
          <input
            className={shell.input}
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="wifi, parking, water"
          />
        </label>
        {error ? <p className={shell.error}>{error}</p> : null}
        <button
          type="submit"
          className={shell.btn}
          style={{ marginTop: "1rem" }}
          disabled={loading}
        >
          {loading ? "Publishing…" : "Publish listing"}
        </button>
      </form>
    </>
  );
}
