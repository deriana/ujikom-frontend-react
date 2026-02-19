import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Link } from "react-router-dom";
import { handleMutation } from "@/utils/handleMutation";
import { useUnreadNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/useNotification";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  // 1. Ambil data unread menggunakan React Query Hook
  const { data: unreadNotifications = [], isLoading } = useUnreadNotifications();

  console.log(unreadNotifications)
  
  // 2. Setup Mutation Hooks
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Aksi Mark Single as Read
  const handleMarkRead = (id: string) => {
    handleMutation(() => markAsReadMutation.mutateAsync(id), {
      loading: "Marking as read...",
      success: "Notification marked as read",
      error: "Failed to mark as read",
    });
  };

  // Aksi Mark All as Read
  const handleMarkAllRead = () => {
    handleMutation(() => markAllAsReadMutation.mutateAsync(), {
      loading: "Updating notifications...",
      success: "All caught up!",
      error: "Failed to update notifications",
    });
  };

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={toggleDropdown}
      >
        {/* Tampilkan dot orange hanya jika ada unread */}
        {unreadNotifications.length > 0 && (
          <span className="absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 flex">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
          </span>
        )}
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
          <path d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-60 mt-4.25 flex h-120 w-87.5 flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:w-90.25 lg:right-0"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Notifications ({unreadNotifications.length})
          </h5>
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            Mark all as read
          </button>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : unreadNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No new notifications</div>
          ) : (
            unreadNotifications.map((notif) => (
              <li key={notif.id}>
                <DropdownItem
                  onItemClick={() => {
                    handleMarkRead(notif.id);
                    // Jika ada URL di data notifikasi, arahkan ke sana
                    // if (notif.data.url) window.location.href = notif.data.url;
                  }}
                  className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
                >
                  <span className="relative block w-full h-10 rounded-full z-1 max-w-10">
                    <img
                      width={40}
                      height={40}
                      src="placeholder_img.jpg" // Ganti dengan notif.data.avatar jika ada
                      alt="User"
                      className="w-full overflow-hidden rounded-full"
                    />
                  </span>

                  <span className="block text-left">
                    <span className="mb-1 block text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                      {notif.data.title}
                    </span>
                    <span className="mb-1.5 block text-theme-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {notif.data.message}
                    </span>

                    <span className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
                      <span>{notif.data.model_type || "System"}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>5 min ago</span> {/* Idealnya gunakan library date-fns / dayjs */}
                    </span>
                  </span>
                </DropdownItem>
              </li>
            ))
          )}
        </ul>

        <Link
          to="/notifications"
          onClick={closeDropdown}
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}