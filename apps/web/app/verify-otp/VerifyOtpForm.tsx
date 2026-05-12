"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";
import {
  extractResetToken,
  getRecoveryEmail,
  setRecoveryEmail,
  setResetContext,
  setResetToken,
} from "@/lib/auth-recovery";

export default function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fromStore = getRecoveryEmail();
    const fromQuery = searchParams.get("email")?.trim() ?? "";
    if (fromStore) setEmail(fromStore);
    else if (fromQuery) {
      setEmail(fromQuery);
      setRecoveryEmail(fromQuery);
    }
  }, [searchParams]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.verifyForgotPasswordOtp({
        email: email.trim(),
        code: code.replace(/\s/g, ""),
      });
      const token = extractResetToken(data);
      if (token) setResetToken(token);
      else setResetContext(email.trim(), code.replace(/\s/g, ""));
      router.push("/reset-password");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Verification failed. Check the code or request a new one from forgot password.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      heroKicker="Security"
      heroTitle="Verify it is you"
      heroLead="Enter the one-time code from your email. Your API should validate the OTP and return a short-lived reset token when configured."
      formTitle="Verification code"
      formSubtitle="6-digit codes are typical; your backend may use a different format."
      footerText="Wrong place?"
      footerLinkHref="/login"
      footerLinkLabel="Back to sign in"
    >
      <form onSubmit={submit} noValidate>
        <div className={styles.fieldBlockFirst}>
          <label className={styles.fieldLabel} htmlFor="vemail">
            Email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Mail size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="vemail"
              className={styles.field}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldLabel} htmlFor="code">
            One-time code
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <KeyRound size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="code"
              className={styles.field}
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="000000"
              maxLength={12}
            />
          </div>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Verifying…" : "Continue"}
        </button>
        <p className={styles.footerNote} style={{ marginTop: "1rem" }}>
          <Link href="/forgot-password" className={styles.linkMuted}>
            Resend / new code
          </Link>
        </p>
      </form>
    </AuthSplitLayout>
  );
}
