import { useMemo } from "react";
// import { AuthContext } from "@/context/AuthContext";
import { 
  Palmtree, 
  Info, 
  CalendarCheck, 
  Activity, 
  Stethoscope, 
  Baby,
  AlertCircle,
} from "lucide-react";
import { useGetMyLeaveBalances } from "@/hooks/useUser";
import PageHeader from "@/components/Mobile/PageHeader";

// --- Skeleton Component (Local) ---
const LeaveBalanceSkeleton = () => (
  <div className="animate-pulse space-y-6 px-6">
    <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-[2.5rem]" />
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
      ))}
    </div>
  </div>
);

// Helper untuk Ikon Dinamis
const getLeaveIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('tahunan')) return <Palmtree size={20} />;
  if (n.includes('sakit')) return <Stethoscope size={20} />;
  if (n.includes('melahirkan')) return <Baby size={20} />;
  if (n.includes('penting')) return <Activity size={20} />;
  return <CalendarCheck size={20} />;
};

export default function LeaveBalances() {
  // const { user } = useContext(AuthContext);
  const { data: employeeData, isLoading } = useGetMyLeaveBalances();
  const currentYear = new Date().getFullYear();

  // Kalkulasi Total Sisa (Hanya yang tidak unlimited)
  const totalRemaining = useMemo(() => {
    if (!employeeData?.leave_balances) return 0;
    return employeeData.leave_balances.reduce((acc, curr) => 
      curr.is_unlimited ? acc : acc + (Number(curr.remaining_days) || 0), 0
    );
  }, [employeeData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent pb-24">
        <header className="p-6 flex items-center justify-between">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="w-10" />
        </header>
        <LeaveBalanceSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent pb-24">
      {/* Header Navigation */}
      <PageHeader
        to="/home"
        title="Leave Balances"
        subtitle={`Period ${currentYear}`}
      />

      <main className="px-6 space-y-6">
        {/* Greeting & Summary Card */}
        <section className="space-y-4">
          {/* <div className="px-1">
            <h2 className="text-xl font-black text-gray-800 dark:text-white">
              Hello, {employeeData?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "Employee"}! 👋
            </h2>
            <p className="text-xs text-gray-500 font-medium">Here is a summary of your leave balance.</p>
          </div> */}

          <div className="relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-200 dark:shadow-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <CalendarCheck size={32} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">
                Total Remaining Leave
              </p>
              <h3 className="text-5xl font-black tracking-tighter">
                {totalRemaining} <span className="text-lg font-bold opacity-70">Days</span>
              </h3>
            </div>
          </div>
        </section>

        {/* Detailed List */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
            <h2 className="text-sm font-black text-gray-800 dark:text-white tracking-tight uppercase">
              Leave Type Details
            </h2>
          </div>

          <div className="grid gap-4">
            {employeeData?.leave_balances?.map((item, index) => {
              const usagePercentage = item.is_unlimited 
                ? 0 
                : Math.min((item.used_days / item.total_days) * 100, 100);
              
              const isLow = !item.is_unlimited && item.remaining_days <= 2;

              return (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-3xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {getLeaveIcon(item.leave_type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {item.leave_type}
                        </h4>
                        {item.is_unlimited && (
                          <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase">
                            Unlimited
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isLow && (
                      <div className="flex items-center gap-1 text-red-500 animate-pulse">
                        <AlertCircle size={14} />
                        <span className="text-[9px] font-black uppercase">Running Low</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Quota</p>
                      <p className="text-sm font-black dark:text-white">
                        {item.is_unlimited ? "∞" : item.total_days}
                      </p>
                    </div>
                    <div className="text-center border-x dark:border-gray-800">
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Used</p>
                      <p className="text-sm font-black text-orange-500">
                        {item.used_days}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Left</p>
                      <p className={`text-sm font-black ${isLow ? 'text-red-500' : 'text-emerald-500'}`}>
                        {item.is_unlimited ? "∞" : item.remaining_days}
                      </p>
                    </div>
                  </div>

                  {!item.is_unlimited && (
                    <div className="space-y-1.5">
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${usagePercentage}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-right font-bold text-gray-400 uppercase">
                        {Math.round(usagePercentage)}% Used
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Info Footer */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3">
          <Info size={18} className="text-blue-600 shrink-0" />
          <p className="text-[10px] text-blue-800 dark:text-blue-400 leading-relaxed font-medium">
            Leave balance for period {currentYear}. Contact HR if there are any data discrepancies.
          </p>
        </div>
      </main>
    </div>
  );
}