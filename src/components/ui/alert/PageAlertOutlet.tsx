import { useEffect } from "react";
import { usePageAlert } from "@/context/PageAlertContext";
import Alert from "./Alert";

export default function PageAlertOutlet() {
  const { alert, clearAlert } = usePageAlert();

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      clearAlert();
    }, 4000);

    return () => clearTimeout(timer);
  }, [alert, clearAlert]);

  if (!alert) return null;

  return (
    <Alert
      variant={alert.variant}
      title={alert.title}
      message={alert.message}
    />
  );
}
