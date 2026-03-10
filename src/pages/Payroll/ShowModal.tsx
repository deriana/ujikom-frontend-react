import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import UserProfile from "@/components/UserProfile";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
} from "lucide-react";
import { useDownloadPayroll, usePayrollByUuid } from "@/hooks/usePayroll";
import { formatRupiah } from "@/utils/currency";
import { PayrollStatusEnum } from "@/types/payroll.types";
import Button from "@/components/ui/button/Button";
import { handleMutation } from "@/utils/handleMutation";
import { formatDateID } from "@/utils/date";

interface PayrollShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PayrollShowSkeleton = () => (
  <div className="animate-pulse space-y-8">
    {/* Header Skeleton */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="space-y-3">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/50 rounded-md" />
        </div>
      </div>
      <div className="h-20 w-50 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800" />
    </div>

    {/* Content Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div className="h-64 w-full bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800" />
        <div className="h-24 w-full bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800" />
      </div>
      <div className="lg:col-span-5 space-y-6">
        <div className="h-48 w-full bg-gray-50 dark:bg-gray-800/30 rounded-3xl border border-gray-100 dark:border-gray-800" />
        <div className="h-32 w-full bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800" />
      </div>
    </div>

    {/* Footer Skeleton */}
    <div className="mt-10 flex gap-4">
      <div className="h-14 flex-1 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <div className="h-14 w-40 bg-gray-100 dark:bg-gray-800/50 rounded-2xl" />
    </div>
  </div>
);

export default function PayrollShowModal({
  uuid,
  isOpen,
  onClose,
}: PayrollShowModalProps) {
  const {
    data: payroll,
    isLoading,
    isError,
    error,
  } = usePayrollByUuid(uuid as string);

  const {mutateAsync: downloadPayroll} = useDownloadPayroll()

  const handleDownload = (uuid: string) => {
    handleMutation(() => downloadPayroll(uuid), {
      loading: "Downloading payroll...",
      success: "Payroll downloaded successfully",
      error: "Failed to download payroll"
    })
  }


  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl w-full m-4">
      <div className="relative w-full rounded-3xl bg-white dark:bg-gray-950 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh]">
        {isLoading ? (
          <PayrollShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center">
            {(error as Error)?.message}
          </div>
        ) : (
          payroll && (
            <>
              {/* HEADER SECTION */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 dark:border-gray-800 pb-8">
          <div className="flex items-center gap-5">
            {payroll && (
              <UserProfile
                src={payroll.employee.profile_photo ?? undefined}
                alt={payroll.employee.name}
                size={80}
                className="ring-4 ring-indigo-50 dark:ring-indigo-900/30 shadow-lg"
              />
            )}
            <div>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <h4 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {payroll.employee.name}
                </h4>
                {payroll && (
                  <Badge
                    size="sm"
                    variant="light"
                    color={
                      payroll.status.label === PayrollStatusEnum.FINALIZED
                        ? "success"
                        : payroll.status.label === PayrollStatusEnum.VOIDED
                        ? "error"
                        : "warning"
                    }
                  >
                    {payroll.status.label.toUpperCase()}
                  </Badge>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
                <Briefcase size={16} />{" "}
                {payroll.employee.position.name || "Position N/A"} •
                <Calendar size={16} className="md:ml-2" /> Period: {formatDateID(payroll.period.start)} - {formatDateID(payroll.period.end)}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 text-right min-w-50">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">
              Take Home Pay
            </p>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {formatRupiah(payroll.summary.net_salary ?? 0)}
            </p>
          </div>
        </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT COLUMN: EARNINGS */}
              <div className="lg:col-span-7 space-y-6">
                <section className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-6">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest text-xs mb-6">
                    <TrendingUp size={16} /> Earnings & Allowances
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-emerald-100/50 dark:border-emerald-900/20">
                      <span className="text-gray-600 dark:text-gray-400">
                        Base Salary
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatRupiah(payroll.earnings.base_salary)}
                      </span>
                    </div>

                    {payroll.earnings.allowances.map((allowance, idx) => {
                      const isPercentage = allowance.type === "percentage";
                      const value = isPercentage
                        ? payroll.earnings.base_salary *
                          (allowance.amount / 100)
                        : allowance.amount;

                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-500">
                            {allowance.name}
                            <small className="text-[10px] uppercase opacity-60">
                              ({allowance.type})
                            </small>
                          </span>
                          <div className="flex flex-col items-end">
                            <span
                              className={`font-semibold ${
                                value >= 0 ? "text-emerald-600" : "text-red-600"
                              }`}
                            >
                              {value >= 0 ? "+" : "-"}
                              {formatRupiah(Math.abs(value))}
                            </span>
                            {isPercentage && (
                              <small className="text-[10px] text-gray-400">
                                ({allowance.amount}% from{" "}
                                {formatRupiah(payroll.earnings.base_salary)})
                              </small>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Overtime Pay</span>
                      <span
                        className={`font-semibold ${
                          payroll.earnings.overtime_pay > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        +{formatRupiah(payroll.earnings.overtime_pay)}
                      </span>
                    </div>

                    {payroll.earnings.manual_adjustment !== 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Adjustment</span>
                        <span
                          className={`font-semibold ${
                            payroll.earnings.manual_adjustment > 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {payroll.earnings.manual_adjustment > 0 ? "+" : "-"}
                          {formatRupiah(
                            Math.abs(payroll.earnings.manual_adjustment),
                          )}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 mt-4 border-t border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Total Gross Salary
                      </span>
                      <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                        {formatRupiah(payroll.earnings.gross_salary)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Adjustment Note */}
                {payroll.adjustment_note && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500 font-bold text-xs uppercase mb-2">
                      <FileText size={14} /> Notes / Remarks
                    </div>
                    <p className="text-sm text-amber-800 dark:text-amber-400 leading-relaxed italic">
                      "{payroll.adjustment_note}"
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: DEDUCTIONS & TAX */}
              <div className="lg:col-span-5 space-y-6">
                <section className="bg-red-50/30 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-3xl p-6">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-xs mb-6">
                    <TrendingDown size={16} /> Deductions
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} /> Attendance Cut
                      </div>
                      <span className="font-semibold text-red-600">
                        -
                        {formatRupiah(
                          payroll.deductions.total_attendance_deduction,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Receipt size={14} /> PPh21 Tax
                      </div>
                      <span className="font-semibold text-red-600">
                        -{formatRupiah(payroll.deductions.tax_amount)}
                      </span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-red-200 dark:border-red-800 flex justify-between items-center">
                      <span className="font-bold text-red-700 dark:text-red-400">
                        Total Deductions
                      </span>
                      <span className="text-xl font-black text-red-700 dark:text-red-400">
                        {formatRupiah(payroll.deductions.total_deduction)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* TAX SUMMARY MINI CARD */}
                <div className="p-6 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-[10px] mb-4">
                    <DollarSign size={12} /> Tax Calculation (PTKP:{" "}
                    {formatRupiah(payroll.tax_summary.ptkp)})
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Taxable Income
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatRupiah(payroll.tax_summary.taxable_income)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">
                        Effective Rate
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {payroll.tax_summary.tax_rate_percent}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="mt-10 flex gap-4">
            <Button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition-all shadow-lg active:scale-[0.98]"
            >
              Done
            </Button>
            {payroll.status.label === PayrollStatusEnum.FINALIZED && (
              <Button
                className="px-8 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-800 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                onClick={() => handleDownload(uuid)}
              >
                Download PDF
              </Button>
            )}
          </div>
            </>
          )
        )}
      </div>
    </Modal>
  );
}
