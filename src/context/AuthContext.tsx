import { createContext, useMemo } from "react";
import * as authApi from "@/api/auth.api";
import { User } from "@/types/auth.types";
import { UserFinalizeActivation } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: loading,
    refetch: refreshUser,
  } = useQuery({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      try {
        return await authApi.getMe();
      } catch {
        localStorage.removeItem("token");
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const permissions = useMemo(() => {
    return user?.roles?.flatMap((role) => role.permissions.map((p) => p.name)) ?? [];
  }, [user]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: any) => authApi.login(email, password),
    onSuccess: () => refreshUser(),
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth-me"], null);
      localStorage.removeItem("token");
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading,
        permissions,
        login: async (email, password) => {
          await loginMutation.mutateAsync({ email, password });
        },
        logout: async () => {
          await logoutMutation.mutateAsync();
        },
        refreshUser: async () => {
          await refreshUser();
        },
        finalizeActivation: async (payload) => {
          await authApi.finalizeActivation(payload);
        },
        resendActivation: async (email) => {
          await authApi.resendActivation(email);
        },
        forgotPassword: async (email) => {
          await authApi.forgotPassword(email);
        },
        checkResetToken: authApi.checkResetToken,
        resetPassword: async (payload) => {
          await authApi.resetPassword(payload);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
