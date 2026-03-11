import { AssessmentInput, AssessmentCategory } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import {
  FileText,
  ClipboardCheck,
  UserCircle,
  Layers,
  Star,
  Banknote,
} from "lucide-react";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useAssessmentCategories } from "@/hooks/useAssessmentCategory";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";
import { useMemo, useEffect, useRef, useState } from "react";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentData: AssessmentInput & { assessment_details?: any[] };
  setAssessmentData: (data: any) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function AssessmentModal({
  isOpen,
  onClose,
  assessmentData,
  setAssessmentData,
  onSubmit,
  isLoading = false,
  isEdit = false,
}: AssessmentModalProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  const { data: employees = [], isLoading: loadingEmployees } = (useGetEmployeeForInput as any)({
    enabled: isOpen,
  });

  const { data: categories = [], isLoading: loadingCategories } = useAssessmentCategories({
    enabled: isOpen,
  });

  // 1. Ref untuk mencegah re-inisialisasi kategori berkali-kali dalam satu sesi buka modal
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      isInitialized.current = false;
      setCurrentPage(0);
    }
  }, [isOpen]);

  // 2. Sinkronisasi kategori (Hanya untuk mode Create)
  useEffect(() => {
    if (isOpen && !isEdit && categories.length > 0 && !isInitialized.current) {
      // Hanya isi jika details masih kosong
      if (!assessmentData.assessment_details || assessmentData.assessment_details.length === 0) {
        const initialDetails = categories.map((cat: AssessmentCategory) => ({
          category_uuid: cat.uuid,
          category_name: cat.name,
          category_description: cat.description,
          score: 0,
          bonus_salary: 0
        }));
        
        // Gunakan functional update agar tidak tabrakan dengan state lain
        setAssessmentData((prev: any) => ({ ...prev, assessment_details: initialDetails }));
      }
      isInitialized.current = true;
    }
  }, [isOpen, isEdit, categories, assessmentData.assessment_details]);

  const selectedEmployee = useMemo(() => {
    if (!assessmentData.evaluatee_nik) return null;
    return employees.find((emp: any) => emp.nik === assessmentData.evaluatee_nik);
  }, [assessmentData.evaluatee_nik, employees]);

  const handleScoreChange = (index: number, score: number) => {
    const newDetails = [...(assessmentData.assessment_details || [])];
    newDetails[index].score = score;
    setAssessmentData({ ...assessmentData, assessment_details: newDetails });
  };

  const handleBonusChange = (index: number, value: number) => {
    const newDetails = [...(assessmentData.assessment_details || [])];
    newDetails[index].bonus_salary = value;
    setAssessmentData({ ...assessmentData, assessment_details: newDetails });
  };

  const paginatedDetails = useMemo(() => {
    const details = assessmentData.assessment_details || [];
    const start = currentPage * itemsPerPage;
    return details.slice(start, start + itemsPerPage);
  }, [assessmentData.assessment_details, currentPage]);

  const totalPages = Math.ceil((assessmentData.assessment_details?.length || 0) / itemsPerPage);

  const isInitialLoading = loadingEmployees || loadingCategories;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {isInitialLoading ? (
          <GlobalModalSkeleton inputsCount={4} hasDateRange={false} />
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2.5 bg-brand-100 dark:bg-brand-900/30 rounded-xl text-brand-600 dark:text-brand-400">
                  <ClipboardCheck size={24} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEdit ? "Update Assessment" : "New Assessment"}
                </h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                {isEdit 
                  ? "Update the scores for this employee's performance." 
                  : `Giving assessment for ${assessmentData.period}`}
              </p>
            </div>

            {/* Profile Info (NIK & Nama yang sedang dinilai) */}
            {selectedEmployee && (
              <div className="mb-6 flex items-center gap-4 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
                <div className="h-14 w-14 rounded-full bg-brand-200 flex items-center justify-center overflow-hidden border-2 border-white">
                  {selectedEmployee.image ? (
                    <img src={selectedEmployee.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <UserCircle size={32} className="text-brand-600" />
                  )}
                </div>
                <div>
                  <h5 className="text-md font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedEmployee.name}
                  </h5>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">NIK: {selectedEmployee.nik}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
              <div className="custom-scrollbar max-h-[55vh] overflow-y-auto px-1 space-y-6">
                
                {/* Global Settings (Employee & Period) - SEKARANG READ ONLY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-2">
                      <UserCircle size={12} /> Target Employee
                    </label>
                    <div className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {selectedEmployee ? `${selectedEmployee.nik} - ${selectedEmployee.name}` : assessmentData.evaluatee_nik}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-2">
                      <Layers size={12} /> Selected Period
                    </label>
                    <div className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {assessmentData.period}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                      <Layers size={14} /> Category Ratings
                    </label>
                    
                    {totalPages > 1 && (
                      <div className="flex items-center gap-3 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                          type="button"
                          disabled={currentPage === 0}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="text-[10px] font-black text-brand-600 disabled:text-gray-400 uppercase tracking-tighter"
                        >
                          Prev
                        </button>
                        <span className="text-[10px] font-bold text-gray-500 tabular-nums">{currentPage + 1} / {totalPages}</span>
                        <button
                          type="button"
                          disabled={currentPage >= totalPages - 1}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="text-[10px] font-black text-brand-600 disabled:text-gray-400 uppercase tracking-tighter"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {paginatedDetails.map((detail, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 shadow-sm ${
                        detail.score === 5 
                          ? "bg-linear-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-900 border-yellow-200 dark:border-yellow-700/50 ring-1 ring-yellow-100 dark:ring-yellow-900/20" 
                          : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">
                            {detail.category_name}
                          </span>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
                            {detail.category_description || categories.find((c: any) => c.uuid === detail.category_uuid)?.description}
                          </p>
                        </div>
                        {detail.score > 0 && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 transition-colors ${
                            detail.score === 5 
                              ? "bg-yellow-400 text-white border-yellow-500 animate-pulse" 
                              : "bg-yellow-100 text-yellow-700 border-yellow-200"
                          }`}>
                            {detail.score === 5 ? "PERFECT 5" : `LEVEL ${detail.score}`}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <div className="flex gap-2 justify-start">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleScoreChange(currentPage * itemsPerPage + index, star)}
                              className={`transition-all transform hover:scale-110 ${
                                detail.score >= star ? "text-yellow-400" : "text-gray-200 dark:text-gray-700"
                              }`}
                            >
                              <Star size={28} fill={detail.score >= star ? "currentColor" : "none"} strokeWidth={detail.score >= star ? 0 : 2} />
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1.5">
                            <Banknote size={12} /> Bonus Salary
                          </label>
                          <CurrencyInput
                            value={detail.bonus_salary || 0}
                            onChange={(val) => handleBonusChange(currentPage * itemsPerPage + index, val)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                    <FileText size={14} /> Evaluation Note
                  </label>
                  <textarea
                    rows={3}
                    value={assessmentData.note || ""}
                    onChange={(e) => setAssessmentData({ ...assessmentData, note: e.target.value })}
                    placeholder="Write your feedback for this employee..."
                    className="w-full px-4 py-3 rounded-xl border dark:text-white border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Cancel
                </button>
                <Button type="submit" disabled={isLoading} className="px-10 py-3 rounded-2xl shadow-xl shadow-brand-500/20">
                  {isLoading ? "Saving..." : isEdit ? "Update Scores" : "Submit Rating"}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
}