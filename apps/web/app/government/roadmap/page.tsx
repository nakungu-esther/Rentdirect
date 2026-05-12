"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import shell from "@/app/shell.module.css";

export default function GovernmentRoadmapPage() {
  const [data, setData] = useState<unknown>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const { data: body } = await api.get<unknown>("/platform/roadmap");
        if (!c) setData(body);
      } catch {
        if (!c) setError("Could not load roadmap.");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  return (
    <>
      <h1 className={shell.h1}>Platform roadmap</h1>
      <p className={shell.lead}>
        <Link href="/government">← Overview</Link>
      </p>
      {error ? <p className={shell.error}>{error}</p> : null}
      <div className={shell.card}>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            lineHeight: 1.5,
            overflow: "auto",
          }}
        >
          {data ? JSON.stringify(data, null, 2) : "Loading…"}
        </pre>
      </div>
    </>
  );
}
