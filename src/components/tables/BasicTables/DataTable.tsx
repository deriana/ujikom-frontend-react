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
import { useState, useMemo } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchableKeys?: (keyof T)[];
  statusConfig?: {
    key: keyof T;
    options: { label: string; value: string }[];
  };
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  loading?: boolean;
  newFilterComponent?: React.ReactNode;
  handleCreate?: () => void;
  createButtonLabel?: string;
  tableTitle?: string;
  label?: string;
}

export function DataTable<T extends object>({
  data,
  columns,
  searchableKeys = [],
  statusConfig,
  // pageSizeOptions = [10, 20, 30, 40, 50],
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
  if (page > totalPages) setPage(1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      {/* FILTER BAR */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
          {tableTitle}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* SEARCH */}
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

          {/* NEW FILTER COMPONENT */}
          {newFilterComponent}

          {/* STATUS FILTER */}
          {statusConfig && (
            <FilterDropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
              options={[
                { label: "All Status", value: "all" },
                { label: "Active", value: "Active" },
                { label: "Pending", value: "Pending" },
                { label: "Cancel", value: "Cancel" },
              ]}
            />
          )}

          {/* LIMIT */}
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

          {/* ADD BUTTON */}
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
            {columns.map((col, i) => (
              <TableCell
                isHeader
                key={i}
                className="px-5 py-3 font-medium text-gray-500"
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>

        {loading ? (
          <TableSkeleton cols={columns.length} rows={5} />
        ) : (
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                key={
                  ("id" in row ? row.id : "uuid" in row ? row.uuid : index) as
                    | string
                    | number
                }
                className="border-b dark:border-white/10"
              >
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
