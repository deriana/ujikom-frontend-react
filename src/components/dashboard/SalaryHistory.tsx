import { SalaryLog } from "@/types";
import { Wallet, Download, CheckCircle2 } from "lucide-react";
import { useDownloadPayroll } from "@/hooks/usePayroll"; 
import { handleMutation } from "@/utils/handleMutation";

export const SalaryHistory = ({ salaryLogs }: { salaryLogs: SalaryLog[] }) => {
  const { mutateAsync: downloadPayroll } = useDownloadPayroll();

  const handleDownload = (uuid: string) => {
    handleMutation(() => downloadPayroll(uuid), {
      loading: "Downloading payroll...",
      success: "Payroll downloaded successfully",
      error: "Failed to download payroll",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Salary History
        </h3>
        <Wallet size={20} className="text-slate-400" />
      </div>

      <div className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400">
              <th className="pb-4 font-medium">Period</th>
              <th className="pb-4 font-medium text-right">Total</th>
              <th className="pb-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {salaryLogs && salaryLogs.length > 0 ? (
              salaryLogs.map((item) => (
                <tr
                  key={item.uuid}
                  className="group transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.period}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600">
                      <CheckCircle2 size={10} /> 
                      <span>{item.payment_date}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.formatted_net_salary}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDownload(item.uuid)}
                      className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 active:scale-95"
                      title="Download Salary Slip"
                    >
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-xs text-slate-400 italic">
                  No salary history available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};