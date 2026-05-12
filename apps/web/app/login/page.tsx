"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { authApi } from "@/lib/api";
import { homePathForRole, setSession, type SessionUser } from "@/lib/session";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";

const HERO_BULLETS = [
  "Role-based dashboards for tenants, landlords, and agents",
  "Contracts and payments designed for the Ugandan market",
  "One identity across web and mobile",
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordResetOk, setPasswordResetOk] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("reset") === "1") {
      setPasswordResetOk(true);
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.login(email.trim(), password);
      const body = data as {
        user: SessionUser;
        accessToken: string;
        refreshToken: string;
      };
      setSession({
        user: body.user,
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
      });
      if (rememberMe && typeof window !== "undefined") {
        window.localStorage.setItem("rd_remember_me", "1");
      } else if (typeof window !== "undefined") {
        window.localStorage.removeItem("rd_remember_me");
      }
      router.replace(homePathForRole(body.user.role));
    } catch {
      setError("Invalid email or password. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      heroTitle="RentDirect UG"
      heroLead="Digital rental infrastructure for Uganda — listings, verified contracts, payments, and workspaces that stay in sync with your mobile app."
      heroBullets={HERO_BULLETS}
      formTitle="Sign in"
      formSubtitle="Enter the email and password for your RentDirect account."
      footerText="New to RentDirect?"
      footerLinkHref="/register"
      footerLinkLabel="Create an account"
    >
      {passwordResetOk ? (
        <p
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900"
          role="status"
        >
          Password updated. Sign in with your new password.
        </p>
      ) : null}
      <form onSubmit={submit} noValidate>
        <div className={`${styles.fieldBlock} ${styles.fieldBlockFirst}`}>
          <label className={styles.fieldLabel} htmlFor="email">
            Work email
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Mail size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="email"
              name="email"
              className={styles.field}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className={styles.fieldBlock}>
          <label className={styles.fieldLabel} htmlFor="password">
            Password
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Lock size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="password"
              name="password"
              className={`${styles.field} ${styles.fieldPassword}`}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
            <button
              type="button"
              className={styles.togglePw}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.rowBetween}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Keep me signed in
          </label>
          <Link className={styles.linkMuted} href="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <p className={`${styles.bodyText} !mb-0 !mt-2`}>
          <Link href="/verify-otp" className={styles.linkMuted}>
            Have a verification code?
          </Link>
        </p>

        {error ? (
          <div className={styles.errorBox} role="alert">
            <AlertCircle size={18} className="shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        ) : null}

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className={styles.divider} aria-hidden>
          Or
        </div>

        <button type="button" className={styles.btnOutline} disabled title="Coming soon">
          Continue with organization SSO
          <span className={styles.badgeSoon}>Soon</span>
        </button>
      </form>
    </AuthSplitLayout>
  );
}
