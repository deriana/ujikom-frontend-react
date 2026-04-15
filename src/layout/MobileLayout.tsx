import { Outlet, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import MobileNavBar from "./MobileNavBar";
import { SiteBrand } from "@/components/SiteBrand";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { useNotifications } from "@/hooks/useNotification";
import { useEffect, useState } from "react";
import { ConnectionAlert } from "@/components/ConnectionAlert";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";

const MobileLayout = () => {
  const { data: notifications = [], isError: apiError } = useNotifications();
  useNotificationPermission();
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    const handleServerDown = () => setServerDown(true);

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);
    window.addEventListener("server-down", handleServerDown);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
      window.removeEventListener("server-down", handleServerDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <SiteBrand logoClassName="rounded-lg" />
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-gray-400">
            <Bell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white dark:border-gray-900">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <ConnectionAlert 
        isOnline={isOnline} 
        isServerError={apiError || serverDown} 
      />

      <main className="flex-1 pb-24 p-4">
        <Outlet />
      </main>

      <MobileNavBar />
    </div>
  );
};

export default MobileLayout;
