"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSessionUser, homePathForRole } from "@/lib/session";
import styles from "@/app/page.module.css";

export function ClientHub() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getSessionUser>>(null);

  useEffect(() => {
    setMounted(true);
    setUser(getSessionUser());
  }, []);

  const dash = user ? homePathForRole(user.role) : null;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>RentDirect</span>
        <span className={styles.badge}>UG</span>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>Digital rental infrastructure</h1>
          <p className={styles.lead}>
            Full-stack RentDirect: browse and list properties, initiate payments,
            manage contracts, and run admin / government oversight — on{" "}
            <strong>web</strong> and <strong>mobile</strong>.
          </p>
          {mounted && user && (
            <p style={{ marginTop: 12 }}>
              <Link
                href={dash ?? "/tenant"}
                className={styles.apiLink}
                style={{ marginRight: 16 }}
              >
                Open your dashboard →
              </Link>
              <Link href="/login" className={styles.apiLink}>
                Switch account
              </Link>
            </p>
          )}
          {mounted && !user && (
            <p style={{ marginTop: 12 }}>
              <Link href="/login" className={styles.apiLink} style={{ marginRight: 16 }}>
                Log in
              </Link>
              <Link href="/register" className={styles.apiLink}>
                Create account
              </Link>
            </p>
          )}
        </section>

        <section className={styles.grid}>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Tenant &amp; agent (web)</h2>
            <p className={styles.cardBody}>
              Search listings, pay rent (MoMo / Airtel flow), view and sign
              contracts. Same APIs as the mobile app.
            </p>
            <Link href="/listings" className={styles.apiLink}>
              Browse listings →
            </Link>
          </article>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Landlord (web)</h2>
            <p className={styles.cardBody}>
              Publish listings, track your inventory, create rental contracts for
              tenants, and monitor payment status.
            </p>
            <Link href="/landlord" className={styles.apiLink}>
              Landlord console →
            </Link>
          </article>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Admin</h2>
            <p className={styles.cardBody}>
              Live module health checks, roadmap visibility, and operations entry
              points (extend with moderation tools as APIs grow).
            </p>
            <Link href="/admin" className={styles.apiLink}>
              Admin console →
            </Link>
          </article>
          <article className={styles.card}>
            <h2 className={styles.cardTitle}>Government</h2>
            <p className={styles.cardBody}>
              Read-only platform roadmap and compliance-oriented views backed by
              the same platform service the API exposes.
            </p>
            <Link href="/government" className={styles.apiLink}>
              Government console →
            </Link>
          </article>
        </section>

        <section className={styles.api}>
          <p className={styles.apiLabel}>Backend API (dev)</p>
          <Link
            href={`${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, "")}/auth/health`}
            className={styles.apiLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check API health →
          </Link>
          <p className={styles.apiHint}>
            Set <code>NEXT_PUBLIC_API_URL</code> if your API is not on{" "}
            <code>localhost:3001</code>.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>RentDirect UG · PropTech · FinTech · GovTech</p>
      </footer>
    </div>
  );
}
