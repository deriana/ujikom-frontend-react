import { createContext, useEffect, useState } from "react";
import * as authApi from "@/api/auth.api";
import { User } from "@/types/auth.types";
import { UserFinalizeActivation } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  finalizeActivation: (payload: UserFinalizeActivation) => Promise<void>;
  resendActivation: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkResetToken: (token: string) => Promise<any>;
  resetPassword: (payload: any) => Promise<void>;
  permissions?: string[];
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const me = await authApi.getMe();
      setUser(me);

      const perms =
        me.roles?.flatMap((role) => role.permissions.map((p) => p.name)) ?? [];

      setPermissions(perms);
    } catch {
      setUser(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await authApi.login(email, password);
    await refreshUser();
  };

  const finalizeActivation = async (payload: UserFinalizeActivation) => {
    await authApi.finalizeActivation(payload);
  }

  const resendActivation = async (email: string) => {
    await authApi.resendActivation(email);
  }

  const forgotPassword = async (email: string) => {
    await authApi.forgotPassword(email);
  };

  const checkResetToken = async (token: string) => {
    return await authApi.checkResetToken(token);
  };

  const resetPassword = async (payload: any) => {
    await authApi.resetPassword(payload);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setPermissions([]);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, permissions, login, logout, refreshUser, finalizeActivation, resendActivation, forgotPassword, checkResetToken, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
