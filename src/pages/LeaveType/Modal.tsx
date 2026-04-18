import React from "react";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import CrudModal from "@/components/ui/modal/CrudModal";
import { LeaveTypeInput } from "@/types";
import { ClipboardList, Users, Activity } from "lucide-react";

interface LeaveTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LeaveTypeInput;
  setData: React.Dispatch<React.SetStateAction<LeaveTypeInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function LeaveTypeModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: LeaveTypeModalProps) {
  const isEdit = Boolean(data.uuid);

  const genderOptions = [
    { label: "All Genders", value: "all" },
    { label: "Male Only", value: "male" },
    { label: "Female Only", value: "female" },
  ];

  const handleQuotaChange = (val: string) => {
    if (val === "") {
      setData({ ...data, default_days: "" as any }); 
    } else {
      setData({ ...data, default_days: Number(val) });
    }
  };

  const toggleInfinite = (isInfinite: boolean) => {
    setData({ ...data, default_days: isInfinite ? (null as any) : 12 });
  };

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Leave Type" : "New Leave Category"}
      description="Policy configuration for employee leave entitlements."
      icon={ClipboardList}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Leave Name */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Leave Name
          </label>
          <Input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            placeholder="e.g. Annual Leave, Sick Leave"
            className="bg-gray-50 dark:bg-white/5"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Default Days (Quota) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Default Days
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <Checkbox
                  checked={data.default_days === null}
                  onChange={(checked) => toggleInfinite(checked)}
                  className="h-3.5 w-3.5"
                />
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-500 transition-colors uppercase tracking-tighter">
                  Infinite
                </span>
              </label>
            </div>
            <div className="relative">
              <Input
                type={data.default_days === null ? "text" : "number"}
                value={data.default_days === null ? "∞" : data.default_days}
                disabled={data.default_days === null}
                onChange={(e) => handleQuotaChange(e.target.value)}
                placeholder={data.default_days === null ? "No Limit" : "0"}
                className={`bg-gray-50 dark:bg-white/5 transition-all ${
                  data.default_days === null ? "text-center font-bold text-lg text-indigo-500" : ""
                }`}
              />
              {data.default_days !== null && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                  Days
                </span>
              )}
            </div>
          </div>

          {/* Gender Eligibility */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Applicability
            </label>
            <Select
              value={data.gender}
              onChange={(val: any) => setData({ ...data, gender: val })}
              options={genderOptions}
            />
          </div>
        </div>

        {/* Toggles Group */}
        <div className="grid grid-cols-1 gap-3">
          {/* Family Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Users size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Family Requirement</p>
                <p className="text-[10px] text-gray-500">Requires married or parental status</p>
              </div>
            </div>
            <Checkbox
              checked={data.requires_family_status}
              onChange={(checked) => setData({ ...data, requires_family_status: checked })}
            />
          </div>

          {/* Active Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 transition-all">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Active Policy</p>
                <p className="text-[10px] text-gray-500">Allow employees to use this leave type</p>
              </div>
            </div>
            <Checkbox
              checked={data.is_active}
              onChange={(checked) => setData({ ...data, is_active: checked })}
            />
          </div>
        </div>
      </div>
    </CrudModal>
  );
}