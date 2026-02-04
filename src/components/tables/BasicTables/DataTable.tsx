import FilterDropdown from "@/components/FilterDropdown";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { Column } from "@/types";
import { Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchableKeys?: (keyof T)[];
  statusConfig?: {
    key: keyof T;
    options: { label: string; value: string }[];
  };
  defaultPageSize?: number;
  loading?: boolean;
  newFilterComponent?: React.ReactNode;
  handleCreate?: () => void;
  tableTitle?: string;
  label?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  searchableKeys = [],
  statusConfig,
  defaultPageSize = 10,
  loading = false,
  newFilterComponent,
  handleCreate,
  tableTitle = "Data Table",
  label = "Data",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);

  // FILTERING
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        searchableKeys.length === 0 ||
        searchableKeys.some((key) =>
          String(item[key] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()),
        );

      const matchStatus =
        !statusConfig ||
        statusFilter === "all" ||
        String(item[statusConfig.key]) === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter, searchableKeys, statusConfig]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  // Reset page if overflow
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  // EMPTY STATES
  const isEmpty = !loading && data.length === 0;
  const isFilteredEmpty =
    !loading && data.length > 0 && filteredData.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      {/* FILTER BAR */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {tableTitle}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          {searchableKeys.length > 0 && (
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm border dark:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:border-white/10"
            />
          )}

          {newFilterComponent}

          {statusConfig && (
            <FilterDropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              options={[
                { label: "All Status", value: "all" },
                ...statusConfig.options,
              ]}
            />
          )}

          <FilterDropdown
            value={String(limit)}
            onChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
            options={[10, 20, 30, 40, 50].map((n) => ({
              label: `Show ${n}`,
              value: String(n),
            }))}
          />

          {handleCreate && (
            <Tooltip content={`Create ${label}`} position="bottom">
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* TABLE */}
      <Table className="w-full text-sm text-left">
        <TableHeader className="border-b dark:border-white/10">
          <TableRow>
            <TableCell
              isHeader
              className="px-5 py-3 font-medium text-gray-500 w-16"
            >
              No
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
          <TableSkeleton cols={columns.length} rows={5} />
        ) : isEmpty ? (
          <TableBody>
            <TableRow>
              <td
                colSpan={columns.length}
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
                colSpan={columns.length}
                className="px-5 py-10 text-center text-gray-500"
              >
                No matching {label.toLowerCase()} found.
              </td>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={
                  "id" in row
                    ? (row as any).id
                    : "uuid" in row
                      ? (row as any).uuid
                      : index
                }
                className="border-b dark:border-white/10"
              >
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
            ))}
          </TableBody>
        )}
      </Table>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-5 py-4 border-t">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 text-gray-800 text-theme-sm dark:text-white/90 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 text-gray-800 text-theme-sm dark:text-white/90 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
