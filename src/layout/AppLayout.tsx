import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { ConnectionAlert } from "@/components/ConnectionAlert";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();

  // 2. Logic state koneksi
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
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-72.5" : "lg:ml-22.5"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        
        <ConnectionAlert 
          isOnline={isOnline} 
          isServerError={serverDown} 
        />

        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet key={location.pathname} />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;