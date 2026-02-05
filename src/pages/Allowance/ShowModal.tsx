import { useAllowanceByUuid } from "@/hooks/useAllowance";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";
import Currency from "@/components/ui/currency/Currency";
import { allowanceTypeMap } from "@/constants/Allowance";

interface AllowanceShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AllowanceShowModal({
  uuid,
  isOpen,
  onClose,
}: AllowanceShowModalProps) {
  const { data: allowance, isLoading, isError, error } = useAllowanceByUuid(
    uuid || ""
  );

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-175 m-4">
      <div className="relative w-full max-w-175 rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-1">
          Allowance Details
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Detailed information about this allowance.
        </p>

        {isLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading...
          </div>
        )}

        {isError && (
          <div className="text-red-500 dark:text-red-400 text-center">
            Failed to load allowance: {(error as Error).message}
          </div>
        )}

        {allowance && (
          <div className="space-y-4 text-gray-800 dark:text-gray-100">
            {/* Name */}
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{allowance.name}</span>
            </div>

            {/* Type */}
            <div className="flex justify-between items-center">
              <span className="font-medium">Type:</span>
              <Badge color={allowanceTypeMap[allowance.type].color} size="sm">
                {allowanceTypeMap[allowance.type].label}
              </Badge>
            </div>

            {/* Amount */}
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>
                <Currency value={allowance.amount} />
              </span>
            </div>

            {/* Creator */}
            <div className="flex justify-between">
              <span className="font-medium">Creator:</span>
              <span>
                {allowance.creator.name} ({allowance.creator.email})
              </span>
            </div>

            {/* Positions */}
            <div>
              <span className="font-medium">Positions:</span>
              {allowance.positions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  No positions assigned.
                </p>
              ) : (
                <ul className="mt-1 ml-5 list-disc space-y-1">
                  {allowance.positions.map((pos) => (
                    <li key={pos.uuid} className="flex justify-between">
                      <span>{pos.name}</span>
                      <Currency value={pos.amount || 0} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Created At */}
            {/* <div className="flex justify-between">
              <span className="font-medium">Created At:</span>
              <span>{allowance.created_at}</span>
            </div> */}

            {/* Updated At */}
            {/* <div className="flex justify-between">
              <span className="font-medium">Updated At:</span>
              <span>{allowance.updated_at}</span>
            </div> */}
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
