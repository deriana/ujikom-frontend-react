import { Palmtree, Infinity, CalendarDays, ShieldCheck } from "lucide-react";
import { SectionCard } from "./ProfileComponent";
import Badge from "../ui/badge/Badge";

export function LeaveBalanceCard({ balances }: { balances: any[] }) {
  if (!balances || balances.length === 0) return null;

  // Pisahkan data agar UI lebih terorganisir
  const limitedLeaves = balances.filter((b) => !b.is_unlimited);
  const unlimitedLeaves = balances.filter((b) => b.is_unlimited);

  return (
    <SectionCard title="Leave Management" icon={Palmtree}>
      <div className="space-y-6">
        {/* SECTION: UNLIMITED (SICK, BEREAVEMENT, ETC) */}
        {unlimitedLeaves.length > 0 && (
          <div className="space-y-4 pt-4"> 
            <div className="flex items-center gap-3 px-1"> 
              <ShieldCheck size={20} className="text-success-500" /> 
              <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider"> 
                Special Benefits
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              {unlimitedLeaves.map((balance, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/80 dark:bg-white/5" 
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Infinity size={18} className="text-success-500" /> 
                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200 truncate"> 
                      {balance.leave_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {balance.description || "No limit for this leave type."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION: BERKUOTA (ANNUAL, ETC) */}
        {limitedLeaves.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <CalendarDays size={14} className="text-brand-500" />
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Quota-Based Leave
              </h4>
            </div>

            <div className="grid gap-3">
              {limitedLeaves.map((balance, index) => {
                const progressWidth = balance.total_days > 0
                  ? (balance.remaining_days / balance.total_days) * 100
                  : 0;

                return (
                  <div
                    key={index}
                    className="group p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 hover:border-brand-500/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {balance.leave_type}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">{balance.year} Period</p>
                      </div>
                      <Badge color="primary" size="sm">
                        {balance.remaining_days} Days Left
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase">Used</span>
                        <span className="text-sm font-bold text-error-500">{balance.used_days}d</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 uppercase">Total Quota</span>
                        <span className="text-sm font-bold dark:text-white">{balance.total_days}d</span>
                      </div>
                    </div>

                    <div className="relative w-full bg-gray-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}