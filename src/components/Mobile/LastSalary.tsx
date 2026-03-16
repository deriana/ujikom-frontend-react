import { Wallet } from "lucide-react";
import { SalaryLog } from "@/types/dashboard.types";

interface LastSalaryProps {
  lastSalary?: SalaryLog;
}

export default function LastSalary({ lastSalary }: LastSalaryProps) {
  if (!lastSalary) return null;

  return (
    <div className="p-6 rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Last Salary ({lastSalary.period})
            </p>
            <p className="text-lg font-black text-gray-900 dark:text-white">
              Rp {Math.floor(lastSalary.net_salary).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase">
          {lastSalary.status === 1 ? "Finalized" : "Draft"}
        </div>
      </div>
    </div>
  );
}
