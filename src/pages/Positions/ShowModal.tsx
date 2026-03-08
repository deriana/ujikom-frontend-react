import { usePositionByUuid } from "@/hooks/usePosition";
import { Modal } from "@/components/ui/modal";
import Currency from "@/components/ui/currency/Currency";
import { Calendar, User, Briefcase, Info, Clock } from "lucide-react";
import { formatDateID } from "@/utils/date";

interface PositionShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PositionShowSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Highlight Card Skeleton */}
    <div className="h-32 w-full bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    
    {/* Info Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800" />
      <div className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800" />
    </div>

    {/* List Section Skeleton */}
    <div className="space-y-3">
      <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full bg-gray-50 dark:bg-gray-800/30 rounded-lg" />
        ))}
      </div>
    </div>

    {/* Button Skeleton */}
    <div className="pt-2">
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  </div>
);

export default function PositionShowModal({
  uuid,
  isOpen,
  onClose,
}: PositionShowModalProps) {
  const {
    data: position,
    isLoading,
    isError,
    error,
  } = usePositionByUuid(uuid || "");

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {isLoading ? "Loading..." : position?.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Info size={14} /> Position configuration details
            </p>
          </div>
        </div>

        {isLoading ? (
          <PositionShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">
            {(error as Error).message}
          </div>
        ) : (
          position && (
            <div className="space-y-6">
              {/* Highlight Card: Amount */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Positions Base Salary
                </span>
                <div className="text-4xl font-black text-blue-700 dark:text-blue-300 mt-1">
                  <Currency value={position.base_salary} />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <User size={14} /> Creator
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {position.creator.name}
                  </p>
                  <p className="text-xs text-gray-500 break-all">
                    {position.creator.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <Calendar size={14} /> Date Created
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {formatDateID(position.created_at)}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Clock size={10} /> Updated: {formatDateID(position.updated_at)}
                  </div>
                </div>
              </div>

              {/* Positions List */}
              <div className="mt-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">
                  <Briefcase size={16} className="text-indigo-500" />
                  Assigned Allowances ({position.allowances.length})
                </div>

                {position.allowances.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-400 text-sm">
                    No positions assigned to this position
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {position.allowances.map((allo) => (
                      <div
                        key={allo.uuid}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {allo.name}
                        </span>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          <Currency value={allo.amount || 0} />
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
