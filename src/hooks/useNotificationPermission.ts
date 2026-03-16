import { useEffect } from "react";

export const useNotificationPermission = () => {
  useEffect(() => {
    const requestPermission = async () => {
      if (!("Notification" in window)) {
        console.warn("Browser does not support notifications");
        return;
      }

      if (Notification.permission === "default") {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            console.log("Notification permission granted!");
          }
        } catch (error) {
          console.error("Failed to request notification permission", error);
        }
      }
    };

    requestPermission();
  }, []);
};