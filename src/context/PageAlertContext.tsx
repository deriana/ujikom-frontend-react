import { createContext, useContext, useState } from "react";

type AlertType = {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
};

type PageAlertContextType = {
  alert: AlertType | null;
  showAlert: (alert: AlertType) => void;
  clearAlert: () => void;
};

const PageAlertContext = createContext<PageAlertContextType | null>(null);

export function PageAlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<AlertType | null>(null);

  const showAlert = (alert: AlertType) => setAlert(alert);
  const clearAlert = () => setAlert(null);

  return (
    <PageAlertContext.Provider value={{ alert, showAlert, clearAlert }}>
      {children}
    </PageAlertContext.Provider>
  );
}

export function usePageAlert() {
  const ctx = useContext(PageAlertContext);
  if (!ctx)
    throw new Error("usePageAlert must be used inside PageAlertProvider");
  return ctx;
}
