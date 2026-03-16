interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 dark:border-white/5">
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 lg:px-3 lg:py-1 text-gray-800 text-theme-sm dark:text-white/90 border border-gray-200 dark:border-white/10 rounded-lg lg:rounded disabled:opacity-50 font-medium min-h-11 lg:min-h-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Prev
        </button>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 lg:px-3 lg:py-1 text-gray-800 text-theme-sm dark:text-white/90 border border-gray-200 dark:border-white/10 rounded-lg lg:rounded disabled:opacity-50 font-medium min-h-11 lg:min-h-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}