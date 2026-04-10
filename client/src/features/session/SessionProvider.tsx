import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import type { UserProfile, LoginRequest, RegisterRequest } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";
import { SessionContext } from "./session-context";

export function SessionProvider({ children }: PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  const refreshCurrentUser = async () => {
    const token = fairroomApi.getAuthToken();

    if (!token) {
      setCurrentUser(null);
      return null;
    }

    try {
      const user = await fairroomApi.getMe();
      setCurrentUser(user);
      return user;
    } catch {
      fairroomApi.clearAuthToken();
      setCurrentUser(null);
      return null;
    }
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const token = fairroomApi.getAuthToken();

        if (!token) {
          if (!cancelled) {
            setCurrentUser(null);
          }
          return;
        }

        try {
          const user = await fairroomApi.getMe();
          if (!cancelled) {
            setCurrentUser(user);
          }
        } catch {
          fairroomApi.clearAuthToken();
          if (!cancelled) {
            setCurrentUser(null);
          }
        }
      } finally {
        if (!cancelled) {
          setIsHydrating(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setAuthenticatedUser = async (token: string) => {
    fairroomApi.setAuthToken(token);

    try {
      const user = await fairroomApi.getMe();
      setCurrentUser(user);
      return user;
    } catch (error) {
      fairroomApi.clearAuthToken();
      setCurrentUser(null);
      throw error;
    }
  };

  const signIn = async (credentials: LoginRequest) => {
    const session = await fairroomApi.login(credentials);
    return setAuthenticatedUser(session.token);
  };

  const register = async (payload: RegisterRequest) => {
    const session = await fairroomApi.register(payload);
    return setAuthenticatedUser(session.token);
  };

  const signOut = () => {
    fairroomApi.clearAuthToken();
    setCurrentUser(null);
  };

  return (
    <SessionContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        isHydrating,
        signIn,
        register,
        signOut,
        refreshCurrentUser,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
