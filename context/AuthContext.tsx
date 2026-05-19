"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/lib/auth/types";

type AuthContextValue = {
  user: AuthUser | null;
  expiresAt: string | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        setExpiresAt(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
      setExpiresAt(data.expiresAt ?? null);
    } catch {
      setUser(null);
      setExpiresAt(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setLoading(false));
  }, [refreshSession]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setExpiresAt(null);
    window.location.href = "/login";
  }, []);

  return (
    <AuthContext.Provider value={{ user, expiresAt, loading, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
