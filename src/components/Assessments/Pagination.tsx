import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  itemsPerPage: number;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 order-2 sm:order-1">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> employees
      </p>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft size={20} className="dark:text-white" />
        </button>
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ChevronRight size={20} className="dark:text-white" />
        </button>
      </div>
    </div>
  );
}
