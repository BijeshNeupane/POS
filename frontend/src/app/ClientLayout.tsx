"use client";
import { clearTokens, getAccessToken } from "@/api/apis/auth/authUtils";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { useColors } from "@/contexts/ThemeContext";
import { Geist, Geist_Mono, Lora, Roboto } from "next/font/google";
import { AppProgressBar } from "next-nprogress-bar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ToasterProvider from "./ToastProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { AuthProvider } from "./AuthProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const lora = Lora({ variable: "--font-lora", subsets: ["latin"] });
const roboto = Roboto({ variable: "--font-roboto", subsets: ["latin"] });

const normalizeRole = (role?: string | null) =>
  (role ?? "").trim().toLowerCase();

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const colors = useColors();

  const isAuthRoute = pathname?.startsWith("/auth");
  const isUserRoute = pathname?.startsWith("/user");
  const isAdminRoute = !isAuthRoute && !isUserRoute;

  useEffect(() => {
    if (isAuthRoute) return;

    const token = getAccessToken();
    if (!token || token.trim() === "") {
      router.replace("/auth/login");
    }

    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;
    const r = normalizeRole(role);

    if (r !== "admin" && r !== "user") {
      clearTokens();
      router.replace("/auth/login");
      return;
    }

    if (r === "admin" && !isAdminRoute) {
      router.replace("/dashboard");
      return;
    }

    if (r === "user" && !isUserRoute) {
      router.replace("/user");
      return;
    }
  }, [isAuthRoute, isUserRoute, isAdminRoute, router]);

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${roboto.variable} antialiased`}
    >
    <AppProgressBar
      height="3px"
      color={colors.primary}
      options={{ showSpinner: false }}
      shallowRouting
    />
    <ThemeToggle />
    <ToasterProvider />
    <ReactQueryProvider>
      <AuthProvider>
        {isAuthRoute ? (
          <>{children}</>
        ) : (
          <div className="flex">
            <span>sidebar</span>
            <main
              className="flex-1 min-w-0 pl-5"
              style={{ backgroundColor: colors.primary }}
            >
              <div
                className="h-screen overflow-auto p-6 scrollbar-hide"
                style={{ backgroundColor: colors.pageBg }}
              >
                {children}
              </div>
            </main>
          </div>
        )}
      </AuthProvider>
    </ReactQueryProvider>
    </div>
  );
};

export default ClientLayout;
