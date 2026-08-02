import { SignupFormInputs } from "@/components/signup/SignupSchema";
import api from "../api";

export const signupUser = async (data: SignupFormInputs) => {
  const response = await api.post(`/api/signup/`, data);
  return response.data;
};
