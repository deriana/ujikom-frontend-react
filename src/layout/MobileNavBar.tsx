import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { mobileItems, } from "@/routes/route"; // Import helper yang tadi
import { hasAnyApprovalPermission } from "@/utils/permission";

export default function MobileNavBar() {
  const { permissions = [] } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const filteredItems = mobileItems.filter((item) => {
    if (!item.permission) return true;

    if (item.permission === "has-any-approval") {
      return hasAnyApprovalPermission(permissions);
    }

    return permissions.includes(item.permission);
  });

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-800 px-6 py-3 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              item.primary 
                ? "-mt-12 bg-blue-600 dark:bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-200 dark:shadow-blue-900/20 text-white" 
                : isActive(item.path) 
                  ? "text-blue-600 dark:text-blue-500 font-bold" 
                  : "text-gray-400 dark:text-gray-500"
            } ${item.primary && isActive(item.path) ? "scale-110" : ""}`}
          >
            <div className={item.primary ? "scale-110" : "transition-transform duration-200 active:scale-90"}>
              {item.icon}
            </div>
            {!item.primary && <span className="text-[10px] font-medium tracking-tight">{item.name}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}