"use client";

import { getAccessToken } from "@/api/apis/auth/authUtils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const getRedirectPathByRole = (role?: string | null) => {
  const r = (role ?? "").trim().toLowerCase();

  if (r === "admin") return "/dashboard";
  if (r === "user") return "/user";

  return "/dashboard";
};

const Home = async () => {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const role =
      typeof window !== "undefined" ? localStorage.getItem("role") : null;

    router.replace(getRedirectPathByRole(role));
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      A Next level POS system
    </div>
  );
};

export default Home;
