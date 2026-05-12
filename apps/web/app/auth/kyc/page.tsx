"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FileText, Shield } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";

const STEPS = [
  {
    title: "Identity",
    body: "Government ID or passport — images are encrypted in transit and at rest when your storage layer is connected.",
    icon: FileText,
  },
  {
    title: "Address proof",
    body: "Utility bill or bank statement dated within the last 90 days (configurable by compliance).",
    icon: Shield,
  },
  {
    title: "Selfie liveness",
    body: "Optional video selfie for high-value leases — integrate your KYC vendor SDK here.",
    icon: Check,
  },
];

export default function KycPage() {
  const [step, setStep] = useState(0);

  return (
    <AuthSplitLayout
      wideForm
      heroKicker="Compliance"
      heroTitle="Verify your profile"
      heroLead="KYC reduces fraud for landlords and unlocks higher payment limits. This wizard is UI-complete; wire your document service and decision engine when ready."
      formTitle="KYC wizard"
      formSubtitle={`Step ${step + 1} of ${STEPS.length} — ${STEPS[step]?.title}`}
      footerText="Not ready?"
      footerLinkHref="/tenant"
      footerLinkLabel="Go to dashboard"
    >
      <div className="mb-6 flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[#1b4332]" : "bg-slate-200"}`}
            aria-hidden
          />
        ))}
      </div>
      <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm">
        {(() => {
          const S = STEPS[step];
          if (!S) return null;
          const Icon = S.icon;
          return (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-[#1b4332]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{S.title}</p>
                  <p className="text-sm text-slate-600">{S.body}</p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className={styles.btnOutline}
                  onClick={() => {
                    /* upload slot */
                  }}
                >
                  Upload front
                </button>
                <button type="button" className={styles.btnOutline}>
                  Upload back
                </button>
              </div>
            </>
          );
        })()}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <button type="button" className={styles.btnOutline} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <button type="button" className={styles.btnPrimary} onClick={() => setStep((s) => s + 1)}>
            Continue
          </button>
        ) : (
          <Link href="/tenant/profile" className={styles.btnPrimary} style={{ textAlign: "center", textDecoration: "none" }}>
            Finish (demo)
          </Link>
        )}
      </div>
    </AuthSplitLayout>
  );
}
