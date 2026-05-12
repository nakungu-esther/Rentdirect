"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  Building2,
  Briefcase,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { homePathForRole, setSession, type SessionUser } from "@/lib/session";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import styles from "@/components/auth/auth-split.module.css";

const ROLES: readonly {
  value: "tenant" | "landlord" | "agent";
  label: string;
  hint: string;
  Icon: LucideIcon;
}[] = [
  { value: "tenant", label: "Tenant", hint: "Search, apply, and pay rent in one place", Icon: Home },
  {
    value: "landlord",
    label: "Landlord",
    hint: "List units, screen tenants, track income",
    Icon: Building2,
  },
  { value: "agent", label: "Agent", hint: "Leads, tours, and commission-ready deals", Icon: Briefcase },
];

const HERO_BULLETS = [
  "Guided onboarding with role-appropriate defaults",
  "Phone-verified profiles aligned with mobile signup",
  "Secure session issued immediately after registration",
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<(typeof ROLES)[number]["value"]>("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role,
      });
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
      router.replace(homePathForRole(body.user.role));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Registration failed. Check your details and try again.";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      wideForm
      heroKicker="Join"
      heroTitle="RentDirect UG"
      heroLead="Create a workspace tailored to how you participate in the rental market — with the same security model as our mobile apps."
      heroBullets={HERO_BULLETS}
      formTitle="Create your account"
      formSubtitle="Choose your role, then add your details. Phone: 9–15 digits with optional country code. Password: at least 8 characters."
      footerText="Already have an account?"
      footerLinkHref="/login"
      footerLinkLabel="Sign in"
    >
      <form onSubmit={submit} noValidate>
        <fieldset className={styles.roleFieldset}>
          <legend className={styles.roleLegend}>I am a</legend>
          <div className={styles.roleGrid}>
            {ROLES.map((r) => {
              const active = role === r.value;
              const Icon = r.Icon;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`${styles.roleBtn} ${active ? styles.roleBtnActive : ""}`}
                  aria-pressed={active}
                >
                  <div className={styles.roleBtnRow}>
                    <span className={styles.roleBtnIcon}>
                      <Icon size={18} strokeWidth={2} aria-hidden />
                    </span>
                    <div className={styles.roleBtnTextCol}>
                      <span className={styles.roleBtnTitle}>{r.label}</span>
                      <span className={styles.roleBtnHint}>{r.hint}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className={styles.fieldBlockFirst}>
          <label className={styles.fieldLabel} htmlFor="fullName">
            Full name
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <User size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="fullName"
              className={styles.field}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={2}
              autoComplete="name"
              placeholder="As on your ID or lease"
            />
          </div>
        </div>

        <div className={styles.fieldBlock}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className={styles.fieldBlock}>
          <label className={styles.fieldLabel} htmlFor="phone">
            Phone
          </label>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>
              <Phone size={18} strokeWidth={2} aria-hidden />
            </span>
            <input
              id="phone"
              className={styles.field}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+256 700 000 000"
              autoComplete="tel"
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
              className={`${styles.field} ${styles.fieldPassword}`}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
          <p className={styles.fieldHint}>
            Use a mix of letters and numbers. Avoid passwords you use on other sites.
          </p>
        </div>

        {error ? (
          <div className={styles.errorBox} role="alert">
            <AlertCircle size={18} className="shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        ) : null}

        <button type="submit" className={styles.btnPrimary} disabled={loading}>
          {loading ? "Creating your workspace…" : "Create account"}
        </button>
      </form>
    </AuthSplitLayout>
  );
}
