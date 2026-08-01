import api from "../api";

// keys
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

// Types
export interface TokenSet {
  access: string;
  refresh: string;
  role: string;
  email: string;
  id: string;
  name: string;
}

// ─── Active-session helpers ──────────────────────────────────────────────────
export const setTokens = (tokens: TokenSet) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
  localStorage.setItem("role", tokens.role);
  localStorage.setItem("email", tokens.email);
  localStorage.setItem("id", tokens.id);
  localStorage.setItem("name", tokens.name);
};

export const getActiveTokens = (): TokenSet | null => {
  if (typeof window === undefined) return null;

  const access = localStorage.getItem(ACCESS_KEY);
  const refresh = localStorage.getItem(REFRESH_KEY);

  if (!access || !refresh) return null;

  const role = localStorage.getItem("role") || "";
  const email = localStorage.getItem("email") || "";
  const id = localStorage.getItem("id") || "";
  const name = localStorage.getItem("name") || "";

  return {
    access,
    refresh,
    role,
    email,
    id,
    name,
  };
};

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
};

export const getUserId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("id");
};

export const getRefreshToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("id");
  localStorage.removeItem("name");
};

export const logout = () => {
  if (typeof window === "undefined") return;
  clearTokens();
};

export const refreshToken = async () => {
  try {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token found");

    const response = await api.post("api/token/refresh/", { refresh });
    const newTokens = response.data;

    setTokens({
      access: newTokens.access,
      refresh,
      role: localStorage.getItem("role") || "",
      email: localStorage.getItem("email") || "",
      id: localStorage.getItem("id") || "",
      name: localStorage.getItem("name") || "",
    });

    return newTokens.access;
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.warn(
        "Refresh token invalid. Clearing tokens and reloading page.",
      );
      clearTokens();
      window.location.reload();
      return "";
    }
    throw err;
  }
};
