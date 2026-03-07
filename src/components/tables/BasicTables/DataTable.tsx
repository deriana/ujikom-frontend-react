import { Can } from "@/components/auth/Can";
import FilterDropdown from "@/components/FilterDropdown";
import Checkbox from "@/components/form/input/Checkbox";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Tooltip from "@/components/ui/tooltip";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { Column } from "@/types";
import { Download, Plus } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

type NestedKeys<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeys<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchableKeys?: NestedKeys<T>[];
  statusConfig?: {
    key: NestedKeys<T>;
    options: { label: string; value: string }[];
  };
  defaultPageSize?: number;
  loading?: boolean;
  newFilterComponent?: React.ReactNode;
  handleCreate?: () => void;
  handleExport?: () => void;
  tableTitle?: string;
  label?: string;
  baseNamePermission?: string;
  extraFilters?: Record<string, string>;
  enableSelection?: boolean;
  selectedIds?: (string | number)[]; 
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  selectionActions?: (selectedIds: (string | number)[]) => React.ReactNode;
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
  handleExport,
  tableTitle = "Data Table",
  label = "Data",
  baseNamePermission,
  extraFilters,
  enableSelection = false,
  onSelectionChange,
  selectionActions,
  selectedIds: controlledSelectedIds, 
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | "index";
    direction: "asc" | "desc";
  }>({ key: "index", direction: "asc" });
  const [internalSelectedIds, setInternalSelectedIds] = useState<(string | number)[]>([]);
  const isControlled = controlledSelectedIds !== undefined;
  const currentSelectedIds = isControlled ? controlledSelectedIds : internalSelectedIds;
  const handleSetSelectedIds = (newSelected: (string | number)[]) => {
    if (!isControlled) {
      setInternalSelectedIds(newSelected);
    }
    onSelectionChange?.(newSelected);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  };

  // FILTERING
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        searchableKeys.length === 0 ||
        searchableKeys.some((key) => {
          const value = getNestedValue(item, String(key));
          return String(value ?? "")
            .toLowerCase()
            .includes(search.toLowerCase());
        });

      const matchStatus =
        !statusConfig ||
        statusFilter === "all" ||
        String(getNestedValue(item, String(statusConfig.key))) === statusFilter;

      const matchExtra = Object.entries(extraFilters || {}).every(
        ([key, val]) => {
          if (val === "all") return true;
          const value = getNestedValue(item, key);
          if (Array.isArray(value)) {
            return value.includes(val);
          }
          return String(value) === val;
        },
      );

      return matchSearch && matchStatus && matchExtra;
    });
  }, [data, search, statusFilter, searchableKeys, statusConfig, extraFilters]);

  // TOGGLE SORT
  const toggleSort = (key: keyof T | "index") => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = useMemo(() => {
    if (!filteredData) return [];

    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === "index") {
        aValue = data.indexOf(a);
        bValue = data.indexOf(b);
      } else {
        aValue = getNestedValue(a, String(sortConfig.key));
        bValue = getNestedValue(b, String(sortConfig.key));
      }

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig, data]);

  // PAGINATION
  const totalPages = Math.max(1, Math.ceil(filteredData.length / limit));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return sortedData.slice(start, start + limit);
  }, [sortedData, page, limit]);

  // Reset page if overflow
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  // SELECTION
  const getRowId = (row: any, index: number) => {
    return "id" in row ? row.id : "uuid" in row ? row.uuid : index;
  };

  const handleSelectAll = (checked: boolean) => {
    const currentIds = paginatedData.map((row, index) =>
      getRowId(row, (page - 1) * limit + index),
    );

    let newSelected: (string | number)[];
    if (checked) {
      newSelected = Array.from(new Set([...currentSelectedIds, ...currentIds]));
    } else {
      newSelected = currentSelectedIds.filter((id) => !currentIds.includes(id));
    }

    handleSetSelectedIds(newSelected);
  };

  const handleSelectRow = (id: string | number) => {
    const newSelected = currentSelectedIds.includes(id)
      ? currentSelectedIds.filter((item) => item !== id)
      : [...currentSelectedIds, id];

    handleSetSelectedIds(newSelected);
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, index) =>
      currentSelectedIds.includes(getRowId(row, (page - 1) * limit + index)),
    );

  // EMPTY STATES
  const isEmpty = !loading && data.length === 0;
  const isFilteredEmpty =
    !loading && data.length > 0 && filteredData.length === 0;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      {/* FILTER BAR */}
      <div className="flex flex-col gap-4 px-5 py-4 border-b border-gray-100 dark:border-white/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            {tableTitle}
          </h3>
          {enableSelection && currentSelectedIds.length > 0 && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
              {currentSelectedIds.length} Selected
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {enableSelection && currentSelectedIds.length > 0 && selectionActions && (
            <div className="flex items-center gap-2 mr-2 border-r pr-2 border-gray-200 dark:border-gray-700">
              {selectionActions(currentSelectedIds)}
            </div>
          )}

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

          {handleExport && (
            <Can
              value={buildPermission(
                baseNamePermission!,
                PERMISSIONS.BASE.EXPORT,
              )}
            >
              <Tooltip content={`Export ${label}`} position="bottom">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-2 px-4 h-9.5 w-full sm:w-auto text-sm font-medium text-white transition bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Download size={16} />
                  <span className="sm:hidden">Export {label}</span>
                </button>
              </Tooltip>
            </Can>
          )}
          {handleCreate && (
            <Can
              value={buildPermission(
                baseNamePermission!,
                PERMISSIONS.BASE.CREATE,
              )}
            >
              <Tooltip content={`Create ${label}`} position="bottom">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center justify-center gap-2 px-4 h-9.5 w-full sm:w-auto text-sm font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus size={16} />
                  <span className="sm:hidden">Create {label}</span>
                </button>
              </Tooltip>
            </Can>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <Table className="w-full text-sm text-left">
          <TableHeader className="sticky top-0 bg-white dark:bg-white/5 z-10 border-b dark:border-white/10">
            <TableRow>
              {enableSelection && (
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
                    {enableSelection && (
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
                      <td
                        key={i}
                        className={`px-5 py-3 ${col.className || ""}`}
                      >
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
