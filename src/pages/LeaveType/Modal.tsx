import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
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

  // Helper untuk handle input angka agar bisa dikosongkan tanpa jadi 0
  const handleQuotaChange = (val: string) => {
    if (val === "") {
      setData({ ...data, default_days: "" as any }); // Izinkan kosong sementara di UI
    } else {
      setData({ ...data, default_days: Number(val) });
    }
  };

  // Handle toggle infinite
  const toggleInfinite = (isInfinite: boolean) => {
    setData({ ...data, default_days: isInfinite ? (null as any) : 12 });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="w-full overflow-hidden rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ClipboardList size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Leave Type" : "New Leave Category"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Policy configuration for employee leave entitlements.
              </p>
            </div>
          </div>
        </div>

        <form
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
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
                  <input
                    type="checkbox"
                    checked={data.default_days === null}
                    onChange={(e) => toggleInfinite(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-0"
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
              <input
                type="checkbox"
                checked={data.requires_family_status}
                onChange={(e) => setData({ ...data, requires_family_status: e.target.checked })}
                className="h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData({ ...data, is_active: e.target.checked })}
                className="h-5 w-5 rounded-md border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Policy" : "Create Policy"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}