import { useEffect, useRef } from "react";
import { useUnreadNotifications } from "@/hooks/useNotification";
import { useSettingsContext } from "@/context/SettingsContext";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationWatcher() {
  const { user } = useAuth();
  const { general } = useSettingsContext();
  
  const { data: unreadNotifications = [] } = useUnreadNotifications();
  
  const appLogo = general?.logo || "/placeholder_img.jpg";
  const prevCountRef = useRef(unreadNotifications.length);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(err => console.error("Permission denied", err));
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (user && unreadNotifications.length > prevCountRef.current) {
        const newestNotif = unreadNotifications[0];

        if (
          typeof window !== "undefined" && 
          "Notification" in window && 
          Notification.permission === "granted" && 
          "serviceWorker" in navigator
        ) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(newestNotif.data.title || "Notifikasi Baru", {
              body: newestNotif.data.message || "Anda memiliki pesan baru",
              icon: appLogo,
              badge: appLogo,
              data: {
                url: window.location.origin + "/notifications",
              },
            });
          }).catch(err => console.error("SW Notification Error:", err));
        }
      }
    } catch (e) {
      console.error("Watcher Error:", e);
    }
    
    prevCountRef.current = unreadNotifications.length;
  }, [unreadNotifications, appLogo, user]);

  return null; 
}