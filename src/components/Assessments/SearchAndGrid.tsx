import { Search, CheckCircle2, CircleDashed, Trash2, Banknote, Eye } from "lucide-react";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import UserProfile from "@/components/UserProfile";
import EmployeeAssessmentView from "@/components/Assessments/EmployeeAssessmentView";
import { Can } from "@/components/auth/Can";
import { RESOURCES } from "@/constants/Resource";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";

interface SearchAndGridProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  loadingEmployees: boolean;
  loadingAssessments: boolean;
  paginatedData: any[];
  handleAction: (row: any) => void;
  openDeleteConfirm: (uuid: string) => void;
  onShow: (uuid: string) => void;
}

export default function SearchAndGrid({
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  loadingEmployees,
  loadingAssessments,
  paginatedData,
  handleAction,
  openDeleteConfirm,
  onShow,
}: SearchAndGridProps) {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">Employee List</h3>
          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-40">
              <Select
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Assessed", value: "assessed" },
                  { label: "Pending", value: "pending" },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search employee..." 
                className="w-full pl-10 pr-4 py-2 dark:text-white bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loadingEmployees || loadingAssessments ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((row: any) => (
              <div key={row.nik} className="group bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <UserProfile src={row.image} alt={row.name} size={48} className="ring-2 ring-gray-50 dark:ring-gray-800" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white leading-tight">{row.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">NIK: {row.nik}</p>
                    </div>
                  </div>
                  {row.is_assessed ? (
                    <Badge color="success" variant="light">
                      <CheckCircle2 size={12} className="mr-1" /> Assessed
                    </Badge>
                  ) : (
                    <Badge color="warning" variant="light">
                      <CircleDashed size={12} className="mr-1" /> Pending
                    </Badge>
                  )}
                </div>

                {row.is_assessed && row.assessment_data.total_bonus_salary > 0 && (
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-xl">
                    <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
                      <Banknote size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider leading-none">Bonus Earned</p>
                      <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">Rp {row.assessment_data.total_bonus_salary.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <EmployeeAssessmentView row={row} />
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                  {row.is_assessed && (
                    <button
                      onClick={() => onShow(row.assessment_data.uuid)}
                      className="p-2.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-100 dark:border-gray-800"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  )}

                  <Can
                    value={
                      row.is_assessed
                        ? buildPermission(RESOURCES.ASSESSMENT, PERMISSIONS.BASE.EDIT)
                        : buildPermission(RESOURCES.ASSESSMENT, PERMISSIONS.BASE.CREATE)
                    }
                  > 
                    {user?.employee?.nik !== row.nik && (
                    <Button 
                      size="sm" 
                      variant={row.is_assessed ? "outline" : "primary"} 
                      onClick={() => handleAction(row)}
                      className="flex-1 rounded-xl h-10 text-xs font-bold"
                    > {row.is_assessed ? "Edit Scores" : "Review"}
                    </Button>
                    )}
                  </Can>

                  {!row.is_assessed && user?.employee?.nik === row.nik && (
                    <div className="flex-1 text-center py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-[10px] font-medium text-gray-400 italic">Waiting for supervisor review</p>
                    </div>
                  )}
                  
                  {row.is_assessed && (
                    <Can value={buildPermission(RESOURCES.ASSESSMENT, PERMISSIONS.BASE.DESTROY)}>
                      <button 
                        onClick={() => openDeleteConfirm(row.assessment_data.uuid)}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Can>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}