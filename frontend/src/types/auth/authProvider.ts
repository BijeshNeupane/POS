import { ReactNode } from "react";

export interface User {
  token: string;
}

export interface AuthContextType {
  user: User | null;
  userLogin: (tokens: User) => void;
  logoutUser: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
