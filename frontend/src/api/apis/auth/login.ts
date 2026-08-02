import { LoginFormInputs } from "@/components/login/LoginSchema";
import api from "../api";

export const loginUser = async (data: LoginFormInputs) => {
  const response = await api.post(`/api/login/`, data);
  return response.data;
};
