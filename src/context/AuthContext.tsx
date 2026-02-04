import { createContext, useEffect, useState } from "react";
import * as authApi from "@/api/auth.api";
import { User } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
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
  try {
    const me = await authApi.getMe();
    setUser(me);

    const perms =
      me.roles?.flatMap(role =>
        role.permissions.map(p => p.name)
      ) ?? [];

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

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setPermissions([]);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  console.log(user);
  console.log(permissions);
  return (
    <AuthContext.Provider value={{ user, loading, permissions, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
