import { DivisionInput } from "@/types/division.types";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { Plus, Trash2, Users, LayoutGrid } from "lucide-react";

interface DivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  divisionData: DivisionInput;
  setDivisionData: (data: DivisionInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function DivisionModal({
  isOpen,
  onClose,
  divisionData,
  setDivisionData,
  onSubmit,
  isLoading = false,
}: DivisionModalProps) {
  const addTeam = () => {
    setDivisionData({
      ...divisionData,
      teams: [...divisionData.teams, { name: "" }],
    });
  };

  const updateTeamName = (index: number, name: string) => {
    setDivisionData({
      ...divisionData,
      teams: divisionData.teams.map((t, i) =>
        i === index ? { ...t, name } : t,
      ),
    });
  };

  const removeTeam = (index: number) => {
    setDivisionData({
      ...divisionData,
      teams: divisionData.teams.filter((_, i) => i !== index),
    });
  };

  const isEdit = !!divisionData.uuid; 

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <LayoutGrid size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Division" : "Create New Division"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {isEdit
              ? `Modifying details for ${divisionData.name}`
              : "Set up a new division and assign teams to it."}
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-1">
            {/* Main Info Card */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  Division Name
                </label>
                <Input
                  type="text"
                  value={divisionData.name}
                  onChange={(e) =>
                    setDivisionData({ ...divisionData, name: e.target.value })
                  }
                  placeholder="e.g. Technology"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Division Code
                </label>
                <Input
                  type="text"
                  value={divisionData.code}
                  onChange={(e) =>
                    setDivisionData({ ...divisionData, code: e.target.value })
                  }
                  placeholder="e.g. TECH"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 font-mono"
                />
              </div>
            </div>

            {/* Teams Management Section */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-indigo-500" />
                  <h5 className="font-bold text-gray-800 dark:text-white">
                    Teams Setup
                  </h5>
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-500">
                    {divisionData.teams.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={addTeam}
                  className="flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition"
                >
                  <Plus size={16} /> Add Team
                </button>
              </div>

              {divisionData.teams.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-gray-800/10">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <Users size={32} strokeWidth={1} />
                    <p className="text-sm">No teams added yet</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3">
                  {divisionData.teams.map((team, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-sm hover:shadow-md"
                    >
                      <div className="flex-none h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xs font-bold text-gray-400">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={team.name}
                          onChange={(e) =>
                            updateTeamName(index, e.target.value)
                          }
                          placeholder="Enter team name..."
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 input-delete-outline"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTeam(index)}
                        className="flex-none p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {isLoading
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Division"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
