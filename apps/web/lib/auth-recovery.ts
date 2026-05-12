const EMAIL_KEY = "rd_recovery_email";
const TOKEN_KEY = "rd_reset_token";
const CONTEXT_KEY = "rd_reset_context";

export function setRecoveryEmail(email: string) {
  try {
    sessionStorage.setItem(EMAIL_KEY, email.trim());
  } catch {
    /* ignore */
  }
}

export function getRecoveryEmail(): string {
  try {
    return sessionStorage.getItem(EMAIL_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearRecoveryEmail() {
  try {
    sessionStorage.removeItem(EMAIL_KEY);
  } catch {
    /* ignore */
  }
}

export function setResetToken(token: string) {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.removeItem(CONTEXT_KEY);
  } catch {
    /* ignore */
  }
}

export function getResetToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearResetToken() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(CONTEXT_KEY);
  } catch {
    /* ignore */
  }
}

export function setResetContext(email: string, code: string) {
  try {
    sessionStorage.setItem(CONTEXT_KEY, JSON.stringify({ email, code }));
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function getResetContext(): { email: string; code: string } | null {
  try {
    const raw = sessionStorage.getItem(CONTEXT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { email?: string; code?: string };
    if (typeof o.email === "string" && typeof o.code === "string") return { email: o.email, code: o.code };
    return null;
  } catch {
    return null;
  }
}

export function extractResetToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  const t = o.resetToken ?? o.token ?? o.access_token;
  return typeof t === "string" && t.length > 0 ? t : null;
}
