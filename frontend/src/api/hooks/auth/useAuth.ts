import { setTokens } from "@/api/apis/auth/authUtils";
import { loginUser } from "@/api/apis/auth/login";
import { signupUser } from "@/api/apis/auth/signup";
import { LoginFormInputs } from "@/components/login/LoginSchema";
import { SignupFormInputs } from "@/components/signup/SignupSchema";
import { AuthContext } from "@/app/AuthProvider";
import { AuthContextType } from "@/types/auth/authProvider";
import { BackendError, getBackendErrorMessage } from "@/types/error/error";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";

const getRedirectPathByRole = (role?: string | null) => {
  const r = (role ?? "").trim().toLowerCase();

  if (r === "admin") return "/dashboard";
  if (r === "user") return "/user";

  return "/dashboard";
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useLoginMutation = (onReset?: () => void) => {
  const router = useRouter();
  const { userLogin } = useAuth();

  return useMutation<
    {
      access: string;
      refresh: string;
      role: string;
      email: string;
      user_id: string;
      name: string;
    },
    AxiosError<BackendError>,
    LoginFormInputs
  >({
    mutationFn: loginUser,

    onSuccess: (data) => {
      if (data.role !== "user" && data.role !== "admin") {
        toast.error("You cant login as " + data.role);
        return;
      }

      setTokens({
        access: data.access,
        refresh: data.refresh,
        role: data.role,
        email: data.email,
        id: data.user_id,
        name: data.name,
      });

      userLogin({ token: data.access });

      onReset?.();
      toast.success("Logged in successfully!");

      router.replace(getRedirectPathByRole(data.role));
    },

    onError: (error) => {
      const message = getBackendErrorMessage(
        error,
        `Login failed. Please try again.`,
      );
      toast.error(message);
    },
  });
};

export const useSignupMutation = () => {
  const router = useRouter();

  return useMutation<unknown, AxiosError<BackendError>, SignupFormInputs>({
    mutationFn: signupUser,

    onSuccess: () => {
      toast.success("Account created successfully!");
      router.replace("/auth/login");
    },

    onError: (error) => {
      const message = getBackendErrorMessage(
        error,
        `Signup failed. Please try again.`,
      );
      toast.error(message);
    },
  });
};
