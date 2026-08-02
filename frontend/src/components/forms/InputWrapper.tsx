"use client";

import { useColors } from "@/contexts/ThemeContext";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

interface InputWrapperProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputWrapper = ({
  label,
  error,
  type = "text",
  ...rest
}: InputWrapperProps) => {
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const colors = useColors();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-sm font-medium"
        style={{ color: colors.textPrimary }}
      >
        {label}
      </label>

      <div className="relative">
        <input
          {...rest}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className="w-full rounded-lg border bg-white px-4 py-2.5 pr-11 text-sm placeholder:text-gray-400 focus:outline-none"
          style={{
            color: colors.inputText,
            backgroundColor: colors.cardBg,
            borderColor: error
              ? colors.error
              : focused
                ? colors.primary
                : colors.border,
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 hover:brightness-90"
            style={{ color: colors.icon }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: colors.error }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputWrapper;
