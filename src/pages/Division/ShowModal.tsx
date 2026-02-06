import { Modal } from "@/components/ui/modal";
import { Calendar, User, Users, Info, Clock, Hash } from "lucide-react";
import { useDivisionByUuid } from "@/hooks/useDivision";
import Badge from "@/components/ui/badge/Badge";

interface DivisionShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DivisionShowModal({
  uuid,
  isOpen,
  onClose,
}: DivisionShowModalProps) {
  const {
    data: division,
    isLoading,
    isError,
    error,
  } = useDivisionByUuid(uuid || "");

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {isLoading ? "Loading..." : division?.name}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Info size={14} /> Division profile and structure
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
          division && (
            <div className="space-y-6">
              {/* Highlight Card: Division Code */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Hash size={14} /> Division Code
                </div>
                <div className="mt-2">
                  <span className="text-3xl font-mono font-black text-indigo-700 dark:text-indigo-300 tracking-wider">
                    {division.code}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <User size={14} /> Creator
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {division.creator.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {division.creator.email}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1 text-xs font-semibold uppercase">
                    <Calendar size={14} /> Date Created
                  </div>
                  <p className="text-gray-900 dark:text-gray-200 font-medium">
                    {division.created_at}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Clock size={10} /> Updated: {division.updated_at}
                  </div>
                </div>
              </div>

              {/* Teams List Section */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                    <Users size={18} className="text-emerald-500" />
                    Teams under this Division
                  </div>
                  <Badge >
                    {division.teams.length} Teams
                  </Badge>
                </div>

                {division.teams.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl text-gray-400 text-sm">
                    No teams assigned yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {division.teams.map((team) => (
                      <div
                        key={team.uuid}
                        className="group flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {team.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                          ID: {team.uuid.toString().substring(0, 8)}...
                        </span>
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
            className="w-full py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition shadow-lg active:scale-[0.98]"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
}