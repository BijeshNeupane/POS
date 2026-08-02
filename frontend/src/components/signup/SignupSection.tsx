"use client";

import { useSignupMutation } from "@/api/hooks/auth/useAuth";
import InputWrapper from "@/components/forms/InputWrapper";
import { useColors } from "@/contexts/ThemeContext";
import {
  SignupFormInputs,
  signupSchema,
} from "@/components/signup/SignupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";

const SignupSection = () => {
  const colors = useColors();

  const methods = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const { mutate, isPending } = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (values: SignupFormInputs) => {
    mutate(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-2"
      style={{ backgroundColor: colors.pageBg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-2xl rounded-2xl p-8 shadow-lg"
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
              Create your account
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
              Sign up as a user to get started
            </p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <InputWrapper
              label="First Name"
              placeholder="Enter first name"
              error={errors.first_name?.message}
              {...register("first_name")}
            />

            <InputWrapper
              label="Middle Name"
              placeholder="Optional"
              error={errors.middle_name?.message}
              {...register("middle_name")}
            />

            <InputWrapper
              label="Last Name"
              placeholder="Enter last name"
              error={errors.last_name?.message}
              {...register("last_name")}
            />

            <InputWrapper
              label="Company Name"
              placeholder="Enter company name"
              error={errors.company_name?.message}
              {...register("company_name")}
            />

            <InputWrapper
              label="Contact Number"
              placeholder="Enter contact number"
              error={errors.contact_no?.message}
              {...register("contact_no")}
            />

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
              placeholder="At least 8 characters"
              error={errors.password?.message}
              {...register("password")}
            />

            <InputWrapper
              label="Purpose"
              placeholder="What will you use the POS for?"
              error={errors.purpose?.message}
              {...register("purpose")}
            />

            <div className="sm:col-span-2">
              <InputWrapper
                label="Address"
                placeholder="Enter your address"
                error={errors.address?.message}
                {...register("address")}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full cursor-pointer rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
              style={{ backgroundColor: colors.primary }}
            >
              {isPending ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>
        </FormProvider>

        <p
          className="mt-6 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="cursor-pointer font-medium hover:underline"
            style={{ color: colors.primary }}
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupSection;
