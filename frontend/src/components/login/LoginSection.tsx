"use client";

import { useLoginMutation } from "@/api/hooks/auth/useAuth";
import InputWrapper from "@/components/forms/InputWrapper";
import { useColors } from "@/contexts/ThemeContext";
import { LoginFormInputs, loginSchema } from "@/components/login/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

const LoginSection = () => {
  const colors = useColors();

  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (values: LoginFormInputs) => {
    mutate(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: colors.pageBg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl p-8 shadow-lg"
        style={{ backgroundColor: colors.cardBg }}
      >
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white"
            style={{ backgroundColor: colors.primary }}
          >
            POS
          </motion.div>

          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Welcome back
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              Log in to your account to continue
            </p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <InputWrapper
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <InputWrapper
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register("password")}
            />

            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full cursor-pointer rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: colors.primary }}
            >
              {isPending ? "Logging in..." : "Log In"}
            </motion.button>
          </form>
        </FormProvider>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="cursor-pointer font-medium hover:underline"
            style={{ color: colors.primary }}
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginSection;
