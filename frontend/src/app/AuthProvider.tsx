"use client";
import { clearTokens, getAccessToken } from "@/api/apis/auth/authUtils";
import {
  AuthContextType,
  AuthProviderProps,
  User,
} from "@/types/auth/authProvider";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

const getRedirectPathByRole = (role?: string | null) => {
  const r = (role ?? "").trim().toLowerCase();

  if (r === "admin") return "/dashboard";
  if (r === "user") return "/user";

  return "/dashboard";
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(() => {
    const token = getAccessToken();
    return token ? { token } : null;
  });

  useEffect(() => {
    const isAuthPage = pathname.startsWith("/auth");

    if (!user && !isAuthPage) {
      router.replace("/auth/login");
      return;
    }

    if (user && isAuthPage) {
      const role =
        typeof window !== "undefined" ? localStorage.getItem("role") : null;

      router.replace(getRedirectPathByRole(role));
    }
  }, [user, pathname, router]);

  useEffect(() => {
    const handleLogout = () => {
      clearTokens();
      setUser(null);
      router.replace("/auth/login");
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [router]);

  const userLogin = (tokens: User) => {
    setUser(tokens);

    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    router.replace(getRedirectPathByRole(role));
  };

  const logoutUser = () => {
    clearTokens();
    setUser(null);
    router.replace("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, userLogin, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
