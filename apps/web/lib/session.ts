export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  phoneVerified?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
};

const ACCESS = "rd_access_token";
const REFRESH = "rd_refresh_token";
const USER = "rd_user";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH);
}

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSession(params: {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}) {
  localStorage.setItem(ACCESS, params.accessToken);
  localStorage.setItem(REFRESH, params.refreshToken);
  localStorage.setItem(USER, JSON.stringify(params.user));
}

/** Merge fields into the stored user (e.g. after role selection). Tokens unchanged. */
export function patchSessionUser(partial: Partial<SessionUser>) {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(USER);
  if (!raw) return;
  try {
    const user = { ...(JSON.parse(raw) as SessionUser), ...partial };
    localStorage.setItem(USER, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USER);
}

export function homePathForRole(role: string): string {
  switch (role) {
    case "landlord":
      return "/landlord";
    case "admin":
      return "/admin";
    case "government":
      return "/government";
    case "agent":
      return "/agent";
    case "tenant":
    default:
      return "/tenant";
  }
}
