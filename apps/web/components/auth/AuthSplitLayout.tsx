import type { ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { RentDirectLogo } from "@/components/brand/RentDirectLogo";
import { AuthPageMotion } from "./AuthPageMotion";
import styles from "./auth-split.module.css";

type AuthSplitLayoutProps = {
  heroKicker?: string;
  heroTitle: string;
  heroLead: string;
  /** Short value props shown under the hero lead (trust + clarity). */
  heroBullets?: readonly string[];
  formTitle: string;
  formSubtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkHref: string;
  footerLinkLabel: string;
  /** Wider right column for longer forms (register). */
  wideForm?: boolean;
};

export function AuthSplitLayout({
  heroKicker = "Welcome",
  heroTitle,
  heroLead,
  heroBullets,
  formTitle,
  formSubtitle,
  children,
  footerText,
  footerLinkHref,
  footerLinkLabel,
  wideForm = false,
}: AuthSplitLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <AuthPageMotion className={styles.card}>
          <aside className={styles.hero}>
            <div className={styles.heroPattern} aria-hidden />
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />
            <div className={styles.heroContent}>
              <p className={styles.heroKicker}>{heroKicker}</p>
              <h1 className={styles.heroTitle}>{heroTitle}</h1>
              <p className={styles.heroLead}>{heroLead}</p>
              {heroBullets && heroBullets.length > 0 ? (
                <ul className={styles.heroBullets}>
                  {heroBullets.map((text) => (
                    <li key={text} className={styles.heroBullet}>
                      <span className={styles.heroBulletIcon}>
                        <Check size={14} strokeWidth={2.5} aria-hidden />
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className={styles.heroTrust} role="note">
                <span className={styles.heroTrustDot} aria-hidden />
                Encrypted sign-in · Same account as the RentDirect mobile app
              </div>
              <p className={styles.heroBack}>
                <Link href="/" className={styles.heroBackLink}>
                  ← Back to home
                </Link>
              </p>
            </div>
          </aside>

          <div className={styles.formPane}>
            <div
              className={
                wideForm ? `${styles.formInner} ${styles.formWide}` : styles.formInner
              }
            >
              <header className={styles.formHeader}>
                <Link href="/" className={styles.brandMark} aria-label="RentDirect UG home">
                  <RentDirectLogo size="sm" priority />
                </Link>
                <h2 className={styles.formTitle}>{formTitle}</h2>
                <p className={styles.formSubtitle}>{formSubtitle}</p>
              </header>
              {children}
              <footer className={styles.formFooter}>
                <p className={styles.footerNote}>
                  {footerText}{" "}
                  <Link href={footerLinkHref}>{footerLinkLabel}</Link>
                </p>
              </footer>
            </div>
          </div>
        </AuthPageMotion>
        <p className={styles.pageLegal}>
          By continuing you agree to our{" "}
          <Link href="/">Terms</Link> and <Link href="/">Privacy</Link>.
        </p>
      </div>
    </div>
  );
}
