import { useNavigate, useParams } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Receipt, 
  Clock, 
  FileText, 
  ChevronLeft,
  Download,
  Briefcase
} from "lucide-react";
import { useDownloadPayroll, usePayrollByUuid } from "@/hooks/usePayroll";
import { formatRupiah } from "@/utils/currency";
import { PayrollStatusEnum } from "@/types/payroll.types";
import { handleMutation } from "@/utils/handleMutation";
import { formatDateID } from "@/utils/date";
import UserProfile from "@/components/UserProfile";
import Badge from "@/components/ui/badge/Badge";
import { useState } from "react";

// Gunakan skeleton yang sudah disederhanakan untuk mobile
const MobileSkeleton = () => (
  <div className="animate-pulse p-5 space-y-6">
    <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full" />
    <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl" />
  </div>
);

export default function PayrollDetailMobile() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { data: payroll, isLoading, isError } = usePayrollByUuid(uuid as string);
  const { mutateAsync: downloadPayroll } = useDownloadPayroll();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (uuid: string) => {
    if (isDownloading) return;
    setIsDownloading(true);
    await handleMutation(() => downloadPayroll(uuid), {
      loading: "Downloading slip...",
      success: "Downloaded",
      error: "Failed"
    });
    setIsDownloading(false);
  };

  if (isLoading) return <MobileSkeleton />;
  if (isError || !payroll) return <div className="p-10 text-center">Data not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent pb-28">
      {/* STICKY TOP NAVIGATION */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-transparent backdrop-blur-md border-b dark:border-white/5 px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-900 dark:text-white" />
        </button>
        <h1 className="font-bold text-gray-900 dark:text-white">Salary Detail</h1>
        <div className="flex items-center">
          {payroll.status.label === PayrollStatusEnum.FINALIZED ? (
            <button
              onClick={() => handleDownload(uuid!)}
              disabled={isDownloading}
              className={`p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-transform ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'active:scale-90'}`}
            >
              <Download size={20} />
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* EMPLOYEE & TOTAL CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 shadow-sm border dark:border-white/5 relative overflow-hidden">
           <div className="flex flex-col items-center text-center">
              <UserProfile
                src={payroll.employee.profile_photo ?? undefined}
                alt={payroll.employee.name}
                size={80}
                className="ring-4 ring-indigo-50 dark:ring-indigo-900/30 mb-4"
              />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {payroll.employee.name}
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1 mb-3">
                {payroll.employee.position.name}
              </p>
              <Badge
                color={payroll.status.label === PayrollStatusEnum.FINALIZED ? "success" : "warning"}
                variant="light"
              >
                {payroll.status.label.toUpperCase()}
              </Badge>
           </div>
           
           <div className="mt-8 pt-6 border-t dark:border-white/5 text-center">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em] mb-1">Take Home Pay</p>
              <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {formatRupiah(payroll.summary.net_salary ?? 0)}
              </h3>
           </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold">
           <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border dark:border-white/5 flex flex-col gap-2">
              <Calendar size={14} className="text-blue-500" />
              <span className="text-gray-400 uppercase">Period</span>
              <span className="text-gray-900 dark:text-white text-xs truncate">
                {formatDateID(payroll.period.start)} - {formatDateID(payroll.period.end)}
              </span>
           </div>
           <div className="bg-white dark:bg-gray-900 p-4 rounded-3xl border dark:border-white/5 flex flex-col gap-2">
              <Briefcase size={14} className="text-indigo-500" />
              <span className="text-gray-400 uppercase">Status</span>
              <span className="text-gray-900 dark:text-white text-xs">Monthly Payroll</span>
           </div>
        </div>

        {/* EARNINGS SECTION */}
        <section className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-4xl p-5 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-[10px] mb-5">
            <TrendingUp size={14} /> Earnings & Allowances
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Base Salary</span>
                <span className="font-bold text-gray-900 dark:text-white">{formatRupiah(payroll.earnings.base_salary)}</span>
             </div>
             {payroll.earnings.allowances.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">{item.name}</span>
                   <span className="font-bold text-emerald-600">+{formatRupiah(item.amount)}</span>
                </div>
             ))}
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Overtime</span>
                <span className="font-bold text-emerald-600">+{formatRupiah(payroll.earnings.overtime_pay)}</span>
             </div>
             <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Total Gross</span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                   {formatRupiah(payroll.earnings.gross_salary)}
                </span>
             </div>
          </div>
        </section>

        {/* DEDUCTIONS SECTION */}
        <section className="bg-red-50/50 dark:bg-red-950/20 rounded-4xl p-5 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-[10px] mb-5">
            <TrendingDown size={14} /> Deductions & Tax
          </div>
          <div className="space-y-4 text-sm font-medium">
             <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Late / Absent</span>
                <span className="text-red-600">-{formatRupiah(payroll.deductions.total_attendance_deduction)}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-2"><Receipt size={14}/> PPh21 Tax</span>
                <span className="text-red-600">-{formatRupiah(payroll.deductions.tax_amount)}</span>
             </div>
             <div className="pt-4 border-t border-red-200 dark:border-red-800 flex justify-between items-center">
                <span className="font-bold text-red-700 dark:text-red-400">Total Deductions</span>
                <span className="text-lg font-black text-red-700 dark:text-red-400">
                   {formatRupiah(payroll.deductions.total_deduction)}
                </span>
             </div>
          </div>
        </section>

        {/* NOTES */}
        {payroll.adjustment_note && (
           <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold text-[10px] uppercase mb-1">
                 <FileText size={14}/> Notes
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-400 italic leading-relaxed">"{payroll.adjustment_note}"</p>
           </div>
        )}
      </div>
    </div>
  );
}