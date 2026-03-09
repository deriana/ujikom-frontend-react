import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { 
  Bell, Check, Trash2, MailOpen, 
  CheckCircle2, AlertCircle, Info, BellRing, Loader2 
} from "lucide-react";
import { handleMutation } from "@/utils/handleMutation";
import { 
  useNotifications, 
  useMarkAsRead, 
  useMarkAllAsRead, 
  useDeleteNotification,
  useDeleteAllNotifications
} from "@/hooks/useNotification";
import { LaravelNotification } from "@/types/notification.types";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

export default function Notification() {
  const { data: notifications = [], isLoading } = useNotifications();
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const markReadMutation = useMarkAsRead();
  const markAllReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  const handleMarkAsRead = (id: string) => {
    handleMutation(() => markReadMutation.mutateAsync(id), {
      loading: "Marking...",
      success: "Message read",
      error: "Failed to update",
    });
  };

  const handleDelete = (id: string) => {
    handleMutation(() => deleteMutation.mutateAsync(id), {
      loading: "Deleting...",
      success: "Notification deleted",
      error: "Failed to delete",
    });
  };

  const handleMarkAllRead = () => {
    handleMutation(() => markAllReadMutation.mutateAsync(), {
      loading: "Processing all...",
      success: "All messages have been read",
      error: "Failed to update",
    });
  };

  const handleDeleteAll = () => {
    setIsDeleteAllModalOpen(true);
  };

  const confirmDeleteAll = () => {
    handleMutation(() => deleteAllMutation.mutateAsync(), {
      loading: "Clearing...",
      success: "Inbox cleared",
      error: "Failed to delete",
      onSuccess: () => setIsDeleteAllModalOpen(false),
    });
  };

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("success") || t.includes("approved") || t.includes("berhasil") || t.includes("disetujui")) 
        return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (t.includes("warning") || t.includes("rejected") || t.includes("peringatan") || t.includes("ditolak")) 
        return <AlertCircle className="text-amber-500" size={18} />;
    if (t.includes("info") || t.includes("new") || t.includes("baru")) 
        return <Info className="text-blue-500" size={18} />;
    return <Bell className="text-gray-400" size={18} />;
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  
  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return notifications.slice(startIndex, startIndex + itemsPerPage);
  }, [notifications, currentPage]);


  return (
    <>
      <PageMeta title="Notification Center" />
      <PageBreadcrumb pageTitle="Notifications" />

      <div className="max-w-4xl mx-auto space-y-6">
        <ComponentCard className="overflow-hidden border-none shadow-sm dark:bg-gray-900/50 dark:border dark:border-white/5">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notification Center</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You have <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount}</span> unread messages
              </p>
            </div>
            
            <div className="flex gap-2">
                {notifications.length > 0 && (
                <>
                    <button
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <MailOpen size={14} /> Read All
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 transition-all shadow-sm"
                    >
                        <Trash2 size={14} /> Clear
                    </button>
                </>
                )}
            </div>
          </div>

          {/* List Section */}
          <div className="mt-2">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Loading latest updates...</p>
                </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {paginatedNotifications.map((notif: LaravelNotification) => (
                  <div
                    key={notif.id}
                    className={`group relative flex gap-4 p-4 transition-all duration-200 sm:rounded-xl my-1 ${
                      !notif.read_at 
                        ? "bg-blue-50/40 dark:bg-blue-900/10 border-l-4 border-blue-500" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/40 border-l-4 border-transparent"
                    }`}
                  >
                    {/* Icon Type (Dinamis berdasarkan Title) */}
                    <div className="shrink-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      {getIcon(notif.data.title)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-sm font-semibold truncate ${!notif.read_at ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                          {notif.data.title}
                        </h4>
                        <span className="shrink-0 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                          {timeAgo(notif.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {notif.data.message}
                      </p>
                      
                      {/* Interactive Actions */}
                      <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read_at && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <Check size={14} strokeWidth={3} /> Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} strokeWidth={2} /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Unread Dot Indicator */}
                    {!notif.read_at && (
                      <div className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 flex items-center">
                         <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
                <div className="relative mb-4">
                  <BellRing className="text-gray-200 dark:text-gray-800" size={80} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inbox Empty</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs text-center mt-1">
                  All notifications have been cleared. We'll let you know when there's something new!
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {notifications.length > itemsPerPage && (
            <div className="flex items-center justify-between px-4 py-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, notifications.length)}</span> of{" "}
                <span className="font-medium">{notifications.length}</span> results
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="px-3 dark:text-white py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-3 dark:text-white py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>

      <ConfirmModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        onConfirm={confirmDeleteAll}
        title="Clear All Notifications"
        message="Are you sure you want to delete all notifications? This action cannot be undone."
        confirmLabel="Yes, Clear All"
        variant="danger"
      />
    </>
  );
}