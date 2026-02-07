// contexts/SettingsContext.tsx
import { createContext, useContext, ReactNode, useMemo } from "react";
import { useSettings } from "@/hooks/useSetting";
import { SettingsData } from "@/types";

interface SettingsContextValue {
  settings?: SettingsData;
  general?: SettingsData["general"]["values"];
  isLoading: boolean;
  isError: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useSettings();

  const value = useMemo(() => ({
    settings: data,
    general: data?.general?.values,
    isLoading,
    isError,
  }), [data, isLoading, isError]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettingsContext must be used inside SettingsProvider");
  return ctx;
};
