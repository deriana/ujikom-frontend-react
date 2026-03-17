import { subscribeWebPush } from "@/api/notification.api";
import { useEffect } from "react";

export const useNotificationPermission = () => {
  useEffect(() => {
    const initPush = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("Service Worker terdaftar:", registration);

        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            // Ambil dari .env atau langsung string dari `php artisan webpush:vapid`
            applicationServerKey: "BImYmGdJrxoS04XJcORplVf5NXQo5KB85jOvjWIQCsJohXji4cDc318Sr0Dx6A_HsPESi0bH-yqBdt-uYRVhL58", 
          });
        }

        // --- BAGIAN PENTING: Kirim ke Laravel ---
        await subscribeWebPush(subscription);
        console.log("PWA Terdaftar di Backend!");

      } catch (error) {
        console.error("Gagal setup push notification:", error);
      }
    };

    // Jalankan hanya jika user sudah login (cek token)
    if (localStorage.getItem("token")) {
        initPush();
    }
  }, []);
};