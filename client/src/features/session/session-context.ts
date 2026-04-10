import { createContext } from "react";
import type { LoginRequest, RegisterRequest, UserProfile } from "@/api/contracts";

export type SessionContextValue = {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  signIn: (credentials: LoginRequest) => Promise<UserProfile>;
  register: (payload: RegisterRequest) => Promise<UserProfile>;
  signOut: () => void;
  refreshCurrentUser: () => Promise<UserProfile | null>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);
