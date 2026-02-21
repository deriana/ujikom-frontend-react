import { LucideIcon, Pencil } from "lucide-react"; // Tambahkan Pencil

export const StatusBadge = ({ status }: { status: string }) => {
  const isSuccess = ['active', 'permanent'].includes(status?.toLowerCase());
  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
      isSuccess 
      ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' 
      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
    }`}>
      {status}
    </span>
  );
};

export const InfoItem = ({ icon: Icon, label, value, className = "" }: { icon: LucideIcon, label: string, value: any, className?: string }) => (
  <div className={`flex items-start gap-3 p-4 rounded-xl border border-gray-50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-white/1 transition-all hover:bg-gray-100/50 dark:hover:bg-white/2 ${className}`}>
    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
      <Icon size={16} className="text-brand-500" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-700 dark:text-white/80 leading-tight">{value || '-'}</p>
    </div>
  </div>
);

export const SectionCard = ({ title, icon: Icon, children, className = "", onEdit }: any) => (
  <div className={`bg-white dark:bg-white/3 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 relative group ${className}`}>
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <Icon size={16} /> {title}
      </h4>
      
      {/* Trigger Tombol Edit */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="p-2 rounded-lg bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all opacity-0 group-hover:opacity-100"
          title={`Edit ${title}`}
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
    {children}
  </div>
);