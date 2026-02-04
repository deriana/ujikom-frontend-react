import { DivisionInput } from "@/types/division.types";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175 m-4">
      <div className="relative w-full max-w-175 rounded-3xl bg-white p-6 dark:bg-gray-900">
        <div className="px-2 pb-4">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {divisionData.name ? "Edit Division" : "Create Division"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill out the form below to {divisionData.name ? "update" : "create"}{" "}
            a division.
          </p>
        </div>

        <form className="flex flex-col">
          <div className="custom-scrollbar max-h-125 overflow-y-auto px-2 pb-3">
            {/* Division Info */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Division Name
                </label>
                <Input
                  type="text"
                  value={divisionData.name}
                  onChange={(e) =>
                    setDivisionData({ ...divisionData, name: e.target.value })
                  }
                  className="mt-1 block w-full border rounded px-3 py-2"
                  placeholder="Division Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Division Code
                </label>
                <Input
                  type="text"
                  value={divisionData.code}
                  onChange={(e) =>
                    setDivisionData({ ...divisionData, code: e.target.value })
                  }
                  className="mt-1 block w-full border rounded px-3 py-2"
                  placeholder="Division Code"
                />
              </div>
            </div>

            {/* Teams */}
            <div className="mt-6">
              <h5 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">
                Teams
              </h5>
              {divisionData.teams.map((team, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <Input
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    placeholder="Team Name"
                    className="flex-1 border rounded px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeTeam(index)}
                    className="text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={addTeam} className="mt-2">
                + Add Team
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
