import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getSessionUser,
  setSession,
} from "./session";

const baseURL =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(
    /\/$/,
    "",
  );

function unwrap<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === "object" &&
    "success" in payload &&
    (payload as { success: boolean }).success === true &&
    "data" in payload
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data !== undefined) {
      response.data = unwrap(response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = getRefreshToken();
      const user = getSessionUser();
      if (!refresh || !user?.id) {
        clearSession();
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: refresh,
          userId: user.id,
        });
        const body = unwrap(res.data) as {
          user: import("./session").SessionUser;
          accessToken: string;
          refreshToken: string;
        };
        setSession({
          user: body.user,
          accessToken: body.accessToken,
          refreshToken: body.refreshToken,
        });
        original.headers.Authorization = `Bearer ${body.accessToken}`;
        return api(original);
      } catch {
        clearSession();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (body: Record<string, unknown>) => api.post("/auth/register", body),
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  /** Request password reset OTP / link (backend contract may vary). */
  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),
  /** Exchange email + OTP for a short-lived reset token. */
  verifyForgotPasswordOtp: (body: { email: string; code: string }) =>
    api.post("/auth/forgot-password/verify", body),
  /** Final step: new password + reset token from verify step. */
  resetPasswordWithToken: (body: { resetToken: string; newPassword: string }) =>
    api.post("/auth/reset-password", body),
  /** Optional: single-shot reset if your API uses email+code+password only. */
  resetPasswordWithCode: (body: { email: string; code: string; newPassword: string }) =>
    api.post("/auth/reset-password-with-code", body),
  /** Workspace role switch when API supports it (otherwise 404). */
  selectRole: (role: string) => api.post("/auth/select-role", { role }),
};
