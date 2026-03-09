import { Outlet, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import MobileNavBar from "./MobileNavBar";
import { SiteBrand } from "@/components/SiteBrand";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";

const MobileLayout = () => {

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <SiteBrand logoClassName="rounded-lg" />
        <div className="flex items-center gap-2">
          <ThemeToggleButton />
          <Link to="/notifications" className="relative p-2 text-gray-600 dark:text-gray-400">
            <Bell size={24} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 pb-24 p-4">
        <Outlet />
      </main>

      <MobileNavBar />
    </div>
  );
};

export default MobileLayout;
