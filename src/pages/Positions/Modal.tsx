import { PositionInput, AllowancePositionPivot } from "@/types";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  positionData: PositionInput;
  setPositionData: React.Dispatch<React.SetStateAction<PositionInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
  allowanceOptions: { uuid: string; name: string; amount: number }[];
}

export default function PositionModal({
  isOpen,
  onClose,
  positionData,
  setPositionData,
  onSubmit,
  isLoading = false,
  allowanceOptions,
}: PositionModalProps) {
  const addAllowance = () => {
    setPositionData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { uuid: "", amount: undefined }],
    }));
  };

  const updateAllowanceField = (
    index: number,
    field: keyof AllowancePositionPivot,
    value: any,
  ) => {
    setPositionData((prev) => {
      const updated = [...prev.allowances];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, allowances: updated };
    });
  };

  const removeAllowance = (index: number) => {
    setPositionData((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175 m-4">
      <div className="relative w-full max-w-175 rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          {" "}
          {positionData.uuid ? "Edit Position" : "Create Position"}
        </h4>

        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-4">
            <Input
              type="text"
              value={positionData.name}
              onChange={(e) =>
                setPositionData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Position Name"
              className="mt-2"
            />

            <CurrencyInput
              value={positionData.base_salary}
              onChange={(val) =>
                setPositionData((prev) => ({ ...prev, base_salary: val }))
              }
              placeholder="Base Salary"
            />

            <div>
              <h5 className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Allowances</h5>

              {positionData.allowances.map((allowance, index) => (
                <div key={index} className="flex items-center gap-2 mt-2">
                  <select
                    value={allowance.uuid ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const selected = allowanceOptions.find(
                        (a) => a.uuid === value,
                      );

                      updateAllowanceField(index, "uuid", value);
                      if (selected) {
                        updateAllowanceField(index, "amount", selected.amount);
                      }
                    }}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Allowance</option>
                    {allowanceOptions.map((a) => (
                      <option key={a.uuid} value={a.uuid}>
                        {a.name}
                      </option>
                    ))}
                  </select>

                  <CurrencyInput
                    value={allowance.amount ?? 0}
                    onChange={(val) =>
                      updateAllowanceField(index, "amount", val)
                    }
                    className="w-40"
                  />

                  <button
                    type="button"
                    onClick={() => removeAllowance(index)}
                    className="text-red-500 font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <Button
                type="button"
                size="sm"
                onClick={addAllowance}
                className="mt-3"
              >
                + Add Allowance
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button size="sm" variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
