import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router-dom";
import { handleMutation } from "@/utils/handleMutation";
import {
  useUnreadNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/useNotification";
import { Download, Plus, Bell } from "lucide-react"; 

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: unreadNotifications = [], isLoading } =
    useUnreadNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const handleMarkRead = (id: string) => {
    handleMutation(() => markAsReadMutation.mutateAsync(id), {
      loading: "Marking as read...",
      success: "Notification marked as read",
      error: "Failed to mark as read",
    });
  };

  const handleMarkAllRead = () => {
    handleMutation(() => markAllAsReadMutation.mutateAsync(), {
      loading: "Updating notifications...",
      success: "All caught up!",
      error: "Failed to update notifications",
    });
  };

  return (
    <div className="relative">
      {/* Button Trigger */}
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {unreadNotifications.length > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2.5 w-2.5 rounded-full bg-orange-500 border-2 border-white dark:border-gray-900 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown Card */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="fixed left-1/2 -translate-x-1/2 top-[120px] sm:absolute sm:top-[110%] sm:left-auto sm:right-0 sm:translate-x-0 mt-3 flex h-[500px] w-[calc(100vw-2rem)] max-w-[380px] sm:w-90 flex-col rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-800 dark:bg-gray-900 z-[999]"
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h5 className="text-base font-semibold text-gray-800 dark:text-white">
            Notifications
            <span className="ml-2 px-2 py-0.5 text-xs bg-orange-100 text-orange-600 rounded-full dark:bg-orange-500/10 dark:text-orange-400">
              {unreadNotifications.length}
            </span>
          </h5>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Mark all as read
          </button>
        </div>

        {/* List - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm">Loading...</span>
            </div>
          ) : unreadNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="p-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400">
                <Bell size={24} />
              </div>
              <p className="text-sm text-gray-500">No new notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {unreadNotifications.map((notif) => (
                <li key={notif.id}>
                  <DropdownItem
                    onItemClick={() => handleMarkRead(notif.id)}
                    className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src="/placeholder_img.jpg"
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                      />
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {notif.data.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                        {notif.data.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 rounded">
                          {notif.data.model_type || "System"}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          5 min ago
                        </span>
                      </div>
                    </div>
                  </DropdownItem>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <Link
            to="/notifications"
            onClick={closeDropdown}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            View All Notifications
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
