import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { AllowanceInput } from "@/types";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";

interface AllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowanceData: AllowanceInput;
  setAllowanceData: (data: AllowanceInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function AllowanceModal({
  isOpen,
  onClose,
  allowanceData,
  setAllowanceData,
  onSubmit,
  isLoading = false,
}: AllowanceModalProps) {
  const isEdit = Boolean(allowanceData.uuid);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175 m-4">
      <div className="relative w-full max-w-175 rounded-3xl bg-white p-6 dark:bg-gray-900">
        <div className="px-2 pb-4">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEdit ? "Edit Allowance" : "Create Allowance"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill out the form below to {isEdit ? "update" : "create"} an
            allowance.
          </p>
        </div>

        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-5 px-2 pb-3">
            {/* Allowance Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allowance Name
              </label>
              <Input
                type="text"
                value={allowanceData.name}
                onChange={(e) =>
                  setAllowanceData({ ...allowanceData, name: e.target.value })
                }
                placeholder="e.g. Transport Allowance"
                className="mt-1"
              />
            </div>

            {/* Allowance Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allowance Type
              </label>
              <select
                value={allowanceData.type}
                onChange={(e) =>
                  setAllowanceData({
                    ...allowanceData,
                    type: e.target.value as "fixed" | "percentage",
                  })
                }
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="fixed">Fixed (Nominal)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </label>

              <div className="relative mt-1">
                <CurrencyInput
                  value={allowanceData.amount}
                  onChange={(val) =>
                    setAllowanceData({ ...allowanceData, amount: val })
                  }
                  placeholder="Masukkan nominal"
                  className="max-w-xs" // Contoh jika ingin membatasi lebar
                />
              </div>

              {allowanceData.type === "percentage" && (
                <p className="text-xs text-gray-500 mt-1">
                  This will be calculated based on salary percentage.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 px-2">
            <Button type="button" size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
