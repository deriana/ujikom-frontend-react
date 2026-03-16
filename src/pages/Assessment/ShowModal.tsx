import { Modal } from "@/components/ui/modal";
import {
  Calendar,
  User,
  Briefcase,
  FileText,
  Star,
  Banknote,
} from "lucide-react";
import { useMemo } from "react";
import { useAssessmentByUuid } from "@/hooks/useAssessment";
import { AssessmentDetail } from "@/types";
import EmployeeSpiderChart from "@/components/Assessments/EmployeeSpiderChart";


interface AssessmentShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const AssessmentShowSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="flex justify-between items-start border-b border-gray-50 dark:border-gray-800 pb-6">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 dark:bg-gray-800/50 rounded-md" />
      </div>
      <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800" />
      ))}
    </div>
    <div className="space-y-3">
      <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-24 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800" />
    </div>
    <div className="space-y-4">
      <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800/50 rounded" />
      <div className="h-32 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700" />
    </div>
  </div>
);

export default function AssessmentShowModal({
  uuid,
  isOpen,
  onClose,
}: AssessmentShowModalProps) {
  const { data: assessment, isLoading, isError, error } = useAssessmentByUuid(uuid || "");

  const castedData = assessment as AssessmentDetail;

  const averageScore = useMemo(() => {
    if (!castedData?.scores?.length) return 0;
    const total = castedData.scores.reduce((acc, curr) => acc + curr.score, 0);
    return (total / castedData.scores.length).toFixed(1);
  }, [castedData]);

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              Performance Review
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <User size={14} /> {castedData?.evaluatee?.name} • {castedData?.evaluatee?.nik}
            </p>
          </div>
        </div>

        {isLoading ? (
          <AssessmentShowSkeleton />
        ) : isError ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
            {(error as Error).message}
          </div>
        ) : (
          castedData && (
            <div className="space-y-6">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Period
                  </p>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-sm">{castedData.period}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Average Rating
                  </p>
                  <div className="flex items-center gap-2 text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    <Star size={18} fill="currentColor" />
                    {averageScore}
                    <span className="text-xs font-normal text-gray-500">
                      / 5.0
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Evaluator
                  </p>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {castedData.evaluator.name ?? "System"}
                  </div>
                </div>
              </div>

              {/* Visualization Section */}
              <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-800 flex justify-center">
                <div className="space-y-2 flex flex-col items-center w-full max-w-md">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Performance Radar</p>
                  <EmployeeSpiderChart details={castedData.scores.map(s => ({ ...s, category_name: s.category_name }))} size={60} />
                </div>
              </div>

              {/* Scores Section */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <Briefcase size={14} /> Category Scores
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {castedData.scores.map((score) => (
                    <div key={score.category_uuid} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {score.category_name}
                        </span>
                        {Number(score.bonus_salary) > 0 && (
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <Banknote size={10} />
                            +Rp {Number(score.bonus_salary).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < (score.score || 0) ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"}
                            fill={i < (score.score || 0) ? "currentColor" : "none"}
                          />
                        ))}
                        <span className="ml-2 text-xs font-bold text-gray-900 dark:text-white">
                          {score.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                  <FileText size={14} /> Evaluation Note
                </label>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                  "{castedData.note || "No additional notes provided."}"
                </div>
              </div>
            </div>
          )
        )}

        <div className="mt-8 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:opacity-90 transition shadow-lg"
          >
            Close Details
          </button>
        </div>
      </div>
    </Modal>
  );
}
