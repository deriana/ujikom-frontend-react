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

export default function Notification() {
  // 1. Ambil data asli dari backend
  const { data: notifications = [], isLoading } = useNotifications();
  
  // 2. Setup Mutations
  const markReadMutation = useMarkAsRead();
  const markAllReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();
  const deleteAllMutation = useDeleteAllNotifications();

  // --- Handlers dengan handleMutation (Toast & Loading) ---
  const handleMarkAsRead = (id: string) => {
    handleMutation(() => markReadMutation.mutateAsync(id), {
      loading: "Menandai...",
      success: "Pesan dibaca",
      error: "Gagal memperbarui",
    });
  };

  const handleDelete = (id: string) => {
    handleMutation(() => deleteMutation.mutateAsync(id), {
      loading: "Menghapus...",
      success: "Notifikasi dihapus",
      error: "Gagal menghapus",
    });
  };

  const handleMarkAllRead = () => {
    handleMutation(() => markAllReadMutation.mutateAsync(), {
      loading: "Memproses semua...",
      success: "Semua pesan telah dibaca",
      error: "Gagal memperbarui",
    });
  };

  const handleDeleteAll = () => {
     if (confirm("Hapus semua notifikasi?")) {
        handleMutation(() => deleteAllMutation.mutateAsync(), {
            loading: "Membersihkan...",
            success: "Kotak masuk dibersihkan",
            error: "Gagal menghapus",
        });
     }
  };

  // --- Helpers ---
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("berhasil") || t.includes("disetujui") || t.includes("success")) 
        return <CheckCircle2 className="text-emerald-500" size={18} />;
    if (t.includes("peringatan") || t.includes("warning") || t.includes("ditolak")) 
        return <AlertCircle className="text-amber-500" size={18} />;
    if (t.includes("info") || t.includes("baru")) 
        return <Info className="text-blue-500" size={18} />;
    return <Bell className="text-gray-400" size={18} />;
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}j lalu`;
    return new Date(date).toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <>
      <PageMeta title="Pusat Notifikasi" />
      <PageBreadcrumb pageTitle="Notifikasi" />

      <div className="max-w-4xl mx-auto space-y-6">
        <ComponentCard className="overflow-hidden border-none shadow-sm dark:bg-gray-900/50 dark:border dark:border-white/5">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pusat Notifikasi</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kamu punya <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount}</span> pesan belum dibaca
              </p>
            </div>
            
            <div className="flex gap-2">
                {notifications.length > 0 && (
                <>
                    <button
                        onClick={handleMarkAllRead}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all shadow-sm"
                    >
                        <MailOpen size={14} /> Baca Semua
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30 transition-all shadow-sm"
                    >
                        <Trash2 size={14} /> Bersihkan
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
                    <p className="text-sm text-gray-500">Memuat kabar terbaru...</p>
                </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {notifications.map((notif: LaravelNotification) => (
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
                            <Check size={14} strokeWidth={3} /> Tandai Terbaca
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} strokeWidth={2} /> Hapus
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kotak Masuk Kosong</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs text-center mt-1">
                  Semua notifikasi telah dibersihkan. Kami akan memberitahumu jika ada kabar baru!
                </p>
              </div>
            )}
          </div>
        </ComponentCard>
      </div>
    </>
  );
}