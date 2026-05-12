"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { authApi } from "@/lib/api";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";
import {
  clearRecoveryEmail,
  clearResetToken,
  getResetContext,
  getResetToken,
} from "@/lib/auth-recovery";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getResetToken();
    const ctx = getResetContext();
    setReady(Boolean(token || ctx));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const token = getResetToken();
      if (token) {
        await authApi.resetPasswordWithToken({ resetToken: token, newPassword: password });
      } else {
        const ctx = getResetContext();
        if (!ctx) {
          setError("Session expired. Start again from forgot password.");
          setLoading(false);
          return;
        }
        await authApi.resetPasswordWithCode({
          email: ctx.email,
          code: ctx.code,
          newPassword: password,
        });
      }
      clearResetToken();
      clearRecoveryEmail();
      router.replace("/login?reset=1");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not reset password. Confirm your API implements reset endpoints.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <AuthSplitLayout
        heroTitle="RentDirect UG"
        heroLead="Start from forgot password, then verify your OTP to reach this step."
        formTitle="Reset unavailable"
        formSubtitle="We could not find an active reset session in this browser."
        footerText="Need help?"
        footerLinkHref="/forgot-password"
        footerLinkLabel="Forgot password"
      >
        <p className={styles.bodyText}>
          Open the link from your email on this device, or repeat the flow from the beginning.
        </p>
        <Link href="/forgot-password" className={styles.btnPrimary} style={{ textAlign: "center", display: "block", textDecoration: "none" }}>
          Start recovery
        </Link>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout
      heroKicker="Security"
      heroTitle="Choose a new password"
      heroLead="Use a strong password you have not reused elsewhere. After saving, sign in with your email and the new password."
      formTitle="New password"
      formSubtitle="Minimum 8 characters. Combine letters, numbers, and symbols when your policy allows."
      footerText="Return to"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <form onSubmit={submit} noValidate>
        <div className={styles.fieldBlockFirst}>
          <label className={styles.fieldLabel} htmlFor="npw">
            New password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Lock size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="npw"
              className={`${styles.field} ${styles.fieldPassword}`}
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className={styles.togglePw}
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className={styles.fieldBlock}>
          <label className={styles.fieldLabel} htmlFor="npw2">
            Confirm password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Lock size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="npw2"
              className={styles.field}
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
