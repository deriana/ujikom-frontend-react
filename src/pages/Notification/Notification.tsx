import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { 
  Bell, Check, Trash2, MailOpen, Circle, 
  CheckCircle2, AlertCircle, Info, BellRing 
} from "lucide-react";

// Dummy Data dengan tambahan field icon warna
const initialNotifications = [
  {
    id: 1,
    title: "Presensi Berhasil",
    message: "Anda telah berhasil melakukan presensi masuk pada jam 08:00 AM.",
    time: "2 menit yang lalu",
    isRead: false,
    type: "success",
  },
  {
    id: 2,
    title: "Tugas Baru",
    message: "Admin menambahkan tugas baru: 'Laporan Mingguan HRIS'.",
    time: "1 jam yang lalu",
    isRead: false,
    type: "info",
  },
  {
    id: 3,
    title: "Pengajuan Cuti Disetujui",
    message: "Pengajuan cuti Anda untuk tanggal 20 Feb telah disetujui oleh HRD.",
    time: "5 jam yang lalu",
    isRead: true,
    type: "success",
  },
  {
    id: 4,
    title: "Peringatan Keamanan",
    message: "Ada upaya login baru dari perangkat yang tidak dikenal.",
    time: "Kemarin",
    isRead: true,
    type: "warning",
  },
];

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotif = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  // Helper untuk render Icon berdasarkan type
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "warning": return <AlertCircle className="text-amber-500" size={18} />;
      case "info": return <Info className="text-blue-500" size={18} />;
      default: return <Bell className="text-gray-400" size={18} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <PageMeta title="Notification" />
      <PageBreadcrumb pageTitle="Notification" />

      <div className="max-w-4xl mx-auto space-y-6">
        <ComponentCard className="overflow-hidden border-none shadow-sm dark:bg-gray-900/50 dark:border dark:border-white/5">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifikasi Pusat</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kamu punya <span className="font-semibold text-blue-600 dark:text-blue-400">{unreadCount}</span> pesan yang belum dibaca
              </p>
            </div>
            
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-all shadow-sm"
              >
                <MailOpen size={16} /> Tandai semua terbaca
              </button>
            )}
          </div>

          {/* List Section */}
          <div className="mt-2">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`group relative flex gap-4 p-4 transition-all duration-200 sm:rounded-xl my-1 ${
                      !notif.isRead 
                        ? "bg-blue-50/40 dark:bg-blue-900/10 border-l-4 border-blue-500" 
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/40 border-l-4 border-transparent"
                    }`}
                  >
                    {/* Icon Type */}
                    <div className="shrink-0 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      {getIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className={`text-sm font-semibold truncate ${!notif.isRead ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                          {notif.title}
                        </h4>
                        <span className="shrink-0 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>
                      
                      {/* Interactive Actions */}
                      <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            <Check size={14} strokeWidth={3} /> Tandai Terbaca
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotif(notif.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400/80 dark:hover:text-red-400"
                        >
                          <Trash2 size={14} strokeWidth={2} /> Hapus
                        </button>
                      </div>
                    </div>

                    {/* Unread Dot Indicator */}
                    {!notif.isRead && (
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
                  <Circle className="absolute -top-1 -right-1 text-white fill-gray-200 dark:fill-gray-800" size={24} />
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