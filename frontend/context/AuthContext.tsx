"use client";
// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, getMe } from "@/lib/api";

interface AuthContext {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
  loading: boolean;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("luxgem_token");
    if (stored) {
      getMe(stored)
        .then(({ user }) => {
          setToken(stored);
          setUser(user);
        })
        .catch(() => localStorage.removeItem("luxgem_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const setAuth = (t: string, u: AuthUser) => {
    localStorage.setItem("luxgem_token", t);
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("luxgem_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, token, setAuth, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
