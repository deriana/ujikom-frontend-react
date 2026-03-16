import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Checkbox from "@/components/form/input/Checkbox";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { Column } from "@/types";

interface TableListProps<T> {
  loading: boolean;
  columns: Column<T>[];
  enableSelection: boolean;
  hideCheckbox?: boolean;
  isAllSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  sortConfig: {
    key: keyof T | "index";
    direction: "asc" | "desc";
  };
  toggleSort: (key: keyof T | "index") => void;
  isEmpty: boolean;
  isFilteredEmpty: boolean;
  paginatedData: T[];
  page: number;
  limit: number;
  getRowId: (row: T, index: number) => string | number;
  currentSelectedIds: (string | number)[];
  handleSelectRow: (id: string | number) => void;
  label: string;
}

export function TableList<T>({
  loading,
  columns,
  enableSelection,
  hideCheckbox = false,
  isAllSelected,
  handleSelectAll,
  sortConfig,
  toggleSort,
  isEmpty,
  isFilteredEmpty,
  paginatedData,
  page,
  limit,
  getRowId,
  currentSelectedIds,
  handleSelectRow,
  label,
}: TableListProps<T>) {
  return (
    <div className="overflow-x-auto hidden lg:block">
      <Table className="w-full text-sm text-left">
        <TableHeader className="sticky top-0 bg-white dark:bg-white/5 z-10 border-b dark:border-white/10">
          <TableRow>
            {enableSelection && !hideCheckbox && (
              <TableCell isHeader className="px-5 py-3 w-10">
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                />
              </TableCell>
            )}
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 w-16 cursor-pointer"
              onClick={() => toggleSort("index")}
            >
              <div className="inline-flex items-center gap-1">
                <span>No</span>
                {sortConfig.key === "index" && (
                  <span className="text-xs">
                    {sortConfig.direction === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </TableCell>

            {columns.map((col, i) => (
              <TableCell
                key={i}
                isHeader
                className="px-5 py-3 font-medium text-gray-500"
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton
            cols={columns.length + (enableSelection ? 2 : 1)}
            rows={5}
          />
        ) : isEmpty ? (
          <TableBody>
            <TableRow>
              <td
                colSpan={columns.length + (enableSelection ? 2 : 1)}
                className="px-5 py-10 text-center text-gray-500"
              >
                No {label.toLowerCase()} available.
              </td>
            </TableRow>
          </TableBody>
        ) : isFilteredEmpty ? (
          <TableBody>
            <TableRow>
              <td
                colSpan={columns.length + (enableSelection ? 2 : 1)}
                className="px-5 py-10 text-center text-gray-500"
              >
                No matching {label.toLowerCase()} found.
              </td>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {paginatedData.map((row, index) => {
              const globalIndex = (page - 1) * limit + index;
              const rowId = getRowId(row, globalIndex);
              const isSelected = currentSelectedIds.includes(rowId);
              return (
                <TableRow
                  key={rowId}
                  className={`border-b dark:border-white/10 ${isSelected ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                >
                  {enableSelection && !hideCheckbox && (
                    <TableCell className="px-5 py-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                    </TableCell>
                  )}
                  <td className="px-5 py-3 text-gray-500">
                    {(page - 1) * limit + index + 1}
                  </td>

                  {columns.map((col, i) => (
                    <td key={i} className={`px-5 py-3 ${col.className || ""}`}>
                      {col.render
                        ? col.render(row)
                        : col.accessor
                          ? String(row[col.accessor] ?? "-")
                          : "-"}
                    </td>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
