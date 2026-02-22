import { createContext, useContext, ReactNode, useMemo } from "react";
import { useGeneral } from "@/hooks/useSetting";
import { GeneralValues } from "@/types";

interface SettingsContextValue {
  general?: GeneralValues;
  isLoading: boolean;
  isError: boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isError } = useGeneral(); 

  const value = useMemo(() => ({
    general: data, 
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
