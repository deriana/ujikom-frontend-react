import { useAllowanceByUuid } from "@/hooks/useAllowance";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import Currency from "@/components/ui/currency/Currency";
import { allowanceTypeMap } from "@/constants/Allowance";
import { Calendar, User, Briefcase, Info, Clock } from "lucide-react"; // Gunakan icon (opsional)
import { formatDateID } from "@/utils/date";

interface AllowanceShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AllowanceShowModal({
  uuid,
  isOpen,
  onClose,
}: AllowanceShowModalProps) {
  const {
    data: allowance,
    isLoading,
    isError,
    error,
  } = useAllowanceByUuid(uuid || "");

  if (!uuid) return null;

  const colorVariants = {
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-blue-700 dark:text-blue-300",
    success:
      "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30 text-green-600 dark:text-green-400 text-green-700 dark:text-green-300",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex gap-3">
              <h4 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {isLoading ? "Loading..." : allowance?.name}
              </h4>
              <span className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                |
              </span>
              {allowance && (
                <Badge color={allowanceTypeMap[allowance.type].color} size="md">
                  {allowanceTypeMap[allowance.type].label}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Info size={14} /> Allowance configuration details
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center animate-pulse text-gray-400">
            Fetching data...
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">
            {(error as Error).message}
          </div>
        ) : (
          allowance && (
            <div className="space-y-6">
              {/* Highlight Card: Amount */}
              <div
                className={`p-6 rounded-2xl border ${
                  allowance.type === "fixed"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30"
                    : "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30"
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    allowance.type === "fixed"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  Total Amount ({allowanceTypeMap[allowance.type].label})
                </span>
                <div
                  className={`text-4xl font-black mt-1 ${
                    allowance.type === "fixed"
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-green-700 dark:text-green-300"
                  }`}
                >
                  {/* Jika percentage, tambahkan simbol % atau gunakan Currency jika fixed */}
                  {allowance.type === "percentage" ? (
                    `${allowance.amount}%`
                  ) : (
                    <Currency value={allowance.amount} />
                  )}
                </div>
              </div>
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <User size={14} /> Creator
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {allowance.creator.name}
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    {allowance.creator.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <Calendar size={14} /> Date Created
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {formatDateID(allowance.created_at)}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Clock size={10} /> Updated: {formatDateID(allowance.updated_at)}
                  </div>
                </div>
              </div>

              {/* Positions List */}
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                  <Briefcase size={16} className="text-indigo-500" />
                  Assigned Positions ({allowance.positions.length})
                </div>

                {allowance.positions.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 text-sm">
                    No positions assigned to this allowance
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {allowance.positions.map((pos) => (
                      <div
                        key={pos.uuid}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {pos.name}
                        </span>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          <Currency value={pos.amount || 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition shadow-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
