import { useEffect, useRef } from "react";
import { useUnreadNotifications } from "@/hooks/useNotification";
import { useSettingsContext } from "@/context/SettingsContext";
import { useAuth } from "@/hooks/useAuth"; // Pastikan import hook auth kamu

export default function NotificationWatcher() {
  const { user } = useAuth(); // Ambil status login
  const { general } = useSettingsContext();
  
  const { data: unreadNotifications = [] } = useUnreadNotifications();
  
  const appLogo = general?.logo || "/placeholder_img.jpg";
  const prevCountRef = useRef(unreadNotifications.length);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (user && unreadNotifications.length > prevCountRef.current) {
      const newestNotif = unreadNotifications[0];

      if (Notification.permission === "granted" && "serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(newestNotif.data.title, {
            body: newestNotif.data.message,
            icon: appLogo,
            badge: appLogo,
            data: {
              url: window.location.origin + "/notifications",
            },
          } as NotificationOptions & { vibrate?: number[] });
        });
      }
    }
    prevCountRef.current = unreadNotifications.length;
  }, [unreadNotifications, appLogo, user]);

  return null; 
}