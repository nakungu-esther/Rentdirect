"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";
import { setRecoveryEmail } from "@/lib/auth-recovery";

const HERO_BULLETS = [
  "OTP or magic-link compatible with your auth service",
  "No password hints stored in the browser",
  "You can continue on mobile if email opens there",
] as const;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
    } catch {
      /* still show generic success to avoid account enumeration */
    } finally {
      setLoading(false);
    }
    setRecoveryEmail(email.trim());
    setSent(true);
  };

  const continueToCode = () => {
    router.push("/verify-otp");
  };

  return (
    <AuthSplitLayout
      heroKicker="Account"
      heroTitle="RentDirect UG"
      heroLead="Recover access with a one-time code sent to your email when your API implements the reset pipeline."
      heroBullets={HERO_BULLETS}
      formTitle="Forgot password"
      formSubtitle={
        sent
          ? "If an account exists for this email, you will receive instructions shortly."
          : "Enter your account email. We will guide you through OTP verification and a new password."
      }
      footerText="Remember your password?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      {sent ? (
        <div className={styles.fieldBlockFirst}>
          <p className={styles.bodyText}>
            For security, we never confirm whether an email is registered. If you requested a reset,
            check your inbox and SMS, then enter the verification code on the next step.
          </p>
          <button type="button" className={styles.btnPrimary} onClick={continueToCode}>
            Enter verification code
          </button>
          <p className={styles.footerNote} style={{ marginTop: "1rem" }}>
            Wrong email?{" "}
            <button
              type="button"
              className={styles.linkMuted}
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
            >
              Start over
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className={styles.fieldBlockFirst}>
            <label className={styles.fieldLabel} htmlFor="email">
              Email
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.inputIcon}>
                <Mail size={18} strokeWidth={2} aria-hidden />
              </span>
              <input
                id="email"
                className={styles.field}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
          </div>
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? "Sending…" : "Send reset instructions"}
          </button>
          <p className={styles.footerNote} style={{ marginTop: "1rem" }}>
            Already have a code?{" "}
            <Link href="/verify-otp" className={styles.linkMuted}>
              Verify OTP
            </Link>
          </p>
        </form>
      )}
    </AuthSplitLayout>
  );
}
