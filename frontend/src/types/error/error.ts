import axios, { AxiosError } from "axios";

export type BackendError =
  | string[]
  | {
      detail?: string;
      message?: string;
      error?: string;
      errors?: Record<string, string[]> | string;
      success?: boolean;
    };

export const getBackendErrorMessage = (
  error?:
    | AxiosError<BackendError>
    | BackendError
    | string
    | Record<string, string[]>,
  fallBack = "Something went wrong",
): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (status === 500) {
      return "Server error. Please try again later.";
    }
  }

  if (!axios.isAxiosError(error)) {
    return fallBack;
  }

  const errorData = error.response?.data;
  console.log("errorData raw:", errorData, typeof errorData);
  if (!errorData) {
    return fallBack;
  }
  if (typeof errorData === "string") {
    return errorData;
  }

  if (Array.isArray(errorData)) {
    return errorData[0];
  }
  console.log("errorData:", errorData);

  if (isFieldError(errorData)) {
    return Object.values(errorData)[0][0];
  }
  const specialError = errorData as {
    detail?: string;
    message?: string;
    error?: string;
    errors?: Record<string, string[]> | string;
  };

  if (specialError.errors) {
    if (typeof specialError.errors === "string") {
      return specialError.errors;
    }

    if (isFieldError(specialError.errors)) {
      // Prefer non_field_errors if present
      if (specialError.errors.non_field_errors?.length) {
        return specialError.errors.non_field_errors[0];
      }

      return Object.values(specialError.errors)[0][0];
    }
  }
  // 🔥 NEW: deep nested errors (like sub_events → participants → non_field_errors)
  const deepMessage = extractDeepErrorMessage(errorData.errors);
  if (deepMessage) {
    return deepMessage;
  }

  return errorData.detail || errorData.message || errorData.error || fallBack;
};

const isFieldError = (error: unknown): error is Record<string, string[]> => {
  return (
    typeof error === "object" &&
    error !== null &&
    Object.values(error).every(
      (v) => Array.isArray(v) && typeof v[0] === "string",
    )
  );
};

const extractDeepErrorMessage = (value: unknown): string | null => {
  if (!value) return null;
  console.log("error is , ", value);

  // Direct string
  if (typeof value === "string") {
    return value;
  }

  // Array → search each item
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = extractDeepErrorMessage(item);
      if (found) return found;
    }
  }

  // Object → search values
  if (typeof value === "object") {
    for (const v of Object.values(value)) {
      const found = extractDeepErrorMessage(v);
      if (found) return found;
    }
  }

  return null;
};
