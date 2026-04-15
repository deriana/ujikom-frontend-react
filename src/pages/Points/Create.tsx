import { useState, useMemo } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { usePointRules } from "@/hooks/usePointRule";
import { useCreatePoint } from "@/hooks/usePoint";
import UserProfile from "@/components/UserProfile";
import { Search, Plus, Star, Info } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { handleMutation } from "@/utils/handleMutation";
import { useEmployeeOptions } from "@/hooks/useEmployeeInput";

export default function CreatePoint() {
  const { employees, isLoading: loadingEmployees } = useEmployeeOptions()
  const { data: rules = [], isLoading: loadingRules } = usePointRules();
  const { mutateAsync: createPoint } = useCreatePoint();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = loadingEmployees || loadingRules;

  const loadingSkeleton = (
    <div className="p-6 space-y-4">
      <div className="h-8 bg-gray-100 dark:bg-white/5 rounded-xl w-1/3 animate-pulse" />
      <div className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl w-full animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  const [search, setSearch] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [formData, setFormData] = useState({
    rule_uuid: "",
    points: 0 as number | string,
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.nik.toLowerCase().includes(search.toLowerCase())
    );
  }, [employees, search]);

  const availableRules = useMemo(() => {
    return rules
      .filter((r) => !r.system_reserve && r.is_active)
      .map((r) => ({
        value: r.uuid,
        label: `${r.event_name} (${r.points >= 0 ? "+" : ""}${r.points} Pts)`,
      }));
  }, [rules]);

  const handleOpenModal = (emp: any) => {
    setSelectedEmployee(emp);
    setFormData({ rule_uuid: "", points: "" });
  };

  const handleSubmit = () => {
    if (!formData.rule_uuid) return;
    
    setIsSubmitting(true);
    handleMutation(
      () => createPoint({
        employee_nik: selectedEmployee.nik,
        rule_uuid: formData.rule_uuid,
        current_points: Number(formData.points)
      }),
      {
        loading: "Assigning points...",
        success: "Points assigned successfully",
        error: "Failed to assign points",
        onSuccess: () => setSelectedEmployee(null),
      }
    );
  };

  if (isLoading) return loadingSkeleton;

  return (
    <>
      <PageMeta title="Manual Point Entry" />
      <PageBreadcrumb pageTitle="Manual Point Entry" />
      
      <div className="space-y-6">
        <ComponentCard title="Select Employee">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employee by name or NIK..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              filteredEmployees.map((emp) => (
                <div
                  key={emp.nik}
                  className="p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-900 flex items-center justify-between group hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <UserProfile src={emp.profile_photo} alt={emp.name} size={40} />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{emp.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{emp.nik}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenModal(emp)}
                    className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ))
            }
          </div>
        </ComponentCard>
      </div>

      <Modal isOpen={!!selectedEmployee} onClose={() => setSelectedEmployee(null)} className="max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assign Points</h3>
              <p className="text-xs text-gray-500">To: {selectedEmployee?.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Select Rule</label>
              <Select
                options={availableRules}
                value={formData.rule_uuid}
                onChange={(val) => {
                  const rule = rules.find(r => r.uuid === val);
                  setFormData({ rule_uuid: val, points: rule?.points || 0 });
                }}
                placeholder="Choose a point rule..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Points Adjustment</label>
              <Input
                type="number"
                value={formData.points === 0 && formData.rule_uuid === "" ? "" : formData.points}
                placeholder="0"
                onChange={(e) => setFormData({ ...formData, points: e.target.value === "" ? "" : Number(e.target.value) })}
              />
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <Info size={10} /> You can override the default rule points here.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEmployee(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.rule_uuid || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}