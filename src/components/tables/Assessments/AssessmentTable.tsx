import { useMemo, useState } from "react";
import {
  useDeleteAssessment,
  useAssessments,
  useCreateAssessment,
  useUpdateAssessment,
} from "@/hooks/useAssessment";
import { useCrudModalForm } from "@/hooks/useCrudModalForm";
import { handleMutation } from "@/utils/handleMutation";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import HeaderAnalytycSection from "@/components/Assessments/HeaderAnalytycSection";
import SearchAndGrid from "@/components/Assessments/SearchAndGrid";
import Pagination from "@/components/Assessments/Pagination";
import { Assessment, AssessmentInput, AssessmentScoreDetail, EmployeeLite, User } from "@/types";
import AssessmentModal from "@/pages/Assessment/Modal";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useShowModal } from "@/hooks/useShowModal";
import AssessmentShowModal from "@/pages/Assessment/ShowModal";

interface EmployeeTracking extends EmployeeLite {
  nik: any;
  is_assessed: boolean;
  assessment_data: Assessment | null; 
}
type AssessmentFormState = AssessmentInput & { assessment_details: AssessmentScoreDetail[] };

export default function AssessmentsTable() {
  const now = new Date();
  const [periodFilter, setPeriodFilter] = useState<string>(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMobile = useIsMobile();

  // Pakai isLoading dan isFetching agar skeleton muncul saat pindah periode/refresh
  const { data: employees = [] as User[], isLoading: loadingEmployees } = (
    useGetEmployeeForInput as any
  )();
  const { 
    data: assessments = [] as Assessment[],
    isLoading: loadingAssessments,
    isFetching: fetchingAssessments,
  } = useAssessments();

  const isInitialLoading = loadingEmployees || loadingAssessments;

  const { mutateAsync: deleteAssessment } = useDeleteAssessment();
  const { mutateAsync: createAssessment } = useCreateAssessment();
  const { mutateAsync: updateAssessment } = useUpdateAssessment();

  const show = useShowModal();

  const crud = useCrudModalForm<AssessmentFormState, AssessmentInput>({
    label: "Assessment",
    emptyForm: {
      evaluatee_nik: "",
      period: periodFilter,
      note: "",
      assessment_details: [],
    },
    validate: (form) => {
      // if (!form.evaluatee_nik) return "Employee is required";
      // const hasUnscored = (form.assessment_details as AssessmentScoreDetail[])?.some(
      //   (d) => d.score === 0,
      // );
      // if (hasUnscored) return "Please rate all categories";
      return null;
    },
    mapToPayload: (form) => ({
      evaluatee_nik: form.evaluatee_nik,
      period: form.period,
      note: form.note?.trim() || null,
      assessment_details: form.assessment_details,
    }),
    createFn: createAssessment,
    updateFn: (uuid, payload) => updateAssessment({ uuid, data: payload }),
  });

  const employeeTrackingData = useMemo(() => {
    return employees.map((emp: EmployeeLite): EmployeeTracking => {
      const existing = assessments.find(
        (a) => a.evaluatee_nik === emp.nik && a.period.startsWith(periodFilter),
      );
      return {
        ...emp,
        is_assessed: !!existing,
        assessment_data: existing || null,
      };
    });
  }, [employees, assessments, periodFilter]);

  const filteredData = useMemo(() => {
    return employeeTrackingData.filter((item: EmployeeTracking) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nik.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === "assessed")
        matchesStatus = item.is_assessed === true;
      else if (statusFilter === "pending")
        matchesStatus = item.is_assessed === false;

      return matchesSearch && matchesStatus;
    });
  }, [employeeTrackingData, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const categoryStats = useMemo(() => {
    const stats: Record<
      string,
      { name: string; total: number; count: number }
    > = {};
    assessments
      .filter((a) => a.period.startsWith(periodFilter))
      .forEach((a) => {
        a.assessment_details?.forEach((d) => {
          if (!d.category_name) return;
          if (!stats[d.category_name]) {
            stats[d.category_name] = {
              name: d.category_name,
              total: 0,
              count: 0,
            };
          }
          stats[d.category_name].total += d.score;
          stats[d.category_name].count += 1;
        });
      });

    return Object.values(stats)
      .map((s) => ({
        name: s.name,
        average: parseFloat((s.total / s.count).toFixed(2)) || 0,
      }))
      .sort((a, b) => b.average - a.average);
  }, [assessments, periodFilter]);

  const bestCategory = categoryStats[0];
  const worstCategory = categoryStats[categoryStats.length - 1];

  const openDeleteConfirm = (uuid: string) => {
    setSelectedUuid(uuid);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUuid) return;
    setIsDeleting(true);
    await handleMutation(() => deleteAssessment(selectedUuid), {
      loading: "Deleting assessment...",
      success: "Assessment deleted successfully",
      error: "Failed to delete assessment",
    });
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  const handleAction = (row: EmployeeTracking) => {
    if (row.is_assessed && row.assessment_data) {
      const item = row.assessment_data;
      crud.openEdit({
        uuid: item.uuid,
        evaluatee_nik: item.evaluatee_nik,
        period: item.period,
        note: item.note || "",
        assessment_details: item.assessment_details.map((d: AssessmentScoreDetail) => ({
          category_uuid: d.category_uuid,
          category_name: d.category_name,
          score: d.score,
          bonus_salary: d.bonus_salary,
        })) as AssessmentScoreDetail[],
      } as any);
    } else {
      crud.openCreate();
      crud.setForm({
        evaluatee_nik: (row as EmployeeTracking).nik,
        period: periodFilter,
        note: "",
        assessment_details: [],
      });
    }
  };

  return (
    <div className="space-y-6">
      {isInitialLoading ? (
        /* SKELETON STATE */
        <div className="space-y-8 animate-pulse">
          {/* Header Analytic Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={`${isMobile ? 'h-32' : 'lg:col-span-2 h-87.5'} bg-gray-200 dark:bg-white/10 rounded-4xl`} />
            {!isMobile && <div className="space-y-4">
              {/* Kartu samping kanan */}
              <div className="h-41.75 bg-gray-200 dark:bg-white/10 rounded-4xl" />
              <div className="h-41.75 bg-gray-200 dark:bg-white/10 rounded-4xl" />
            </div>}
          </div>

          {/* Search Bar & Filter Skeleton */}
          <div className="flex justify-between items-center gap-4">
            <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded-xl" />
            <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-xl" />
          </div>

          {/* Grid Employee Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(isMobile ? 2 : 6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 dark:bg-white/10 rounded-4xl border border-transparent dark:border-white/5"
              />
            ))}
          </div>
        </div>
      ) : (
        /* REAL CONTENT */
        <>
          <HeaderAnalytycSection
            periodFilter={periodFilter}
            setPeriodFilter={setPeriodFilter}
            categoryStats={categoryStats}
            bestCategory={bestCategory}
            worstCategory={worstCategory}
            totalEmployees={employees.length}
            assessedCount={assessments.filter(a => a.period.startsWith(periodFilter)).length}
            isMobile={isMobile}
          />

          <SearchAndGrid
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            loadingEmployees={loadingEmployees}
            loadingAssessments={fetchingAssessments} 
            paginatedData={paginatedData}
            handleAction={handleAction}
            openDeleteConfirm={openDeleteConfirm}
            onShow={show.open}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
          />
        </>
      )}

      <AssessmentModal
        isOpen={crud.isOpen}
        onClose={crud.close}
        assessmentData={crud.form}
        setAssessmentData={crud.setForm}
        onSubmit={crud.submit}
        isLoading={crud.loading}
        isEdit={crud.isEdit}
      />

      <AssessmentShowModal
        uuid={show.showId}
        isOpen={show.isOpen}
        onClose={show.close}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Assessment"
        message="Are you sure you want to delete this assessment? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
