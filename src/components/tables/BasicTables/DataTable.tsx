import { TableCardSkeleton } from "@/components/skeleton/TableCardSkeleton";
import { Column } from "@/types";
import { LayoutGrid, List } from "lucide-react";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { DataTableCard } from "./DataTableCard";
import { DataTablePagination } from "./DataTablePagination";
import { FilterBar } from "./FilterBar";
import { TableList } from "./Table";

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
  hideChecbox?: boolean;
  gridCols?: 1 | 2 | 3 | 4;
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
  hideChecbox = false,
  gridCols = 3,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultPageSize);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | "index";
    direction: "asc" | "desc";
  }>({ key: "index", direction: "asc" });
  const [internalSelectedIds, setInternalSelectedIds] = useState<
    (string | number)[]
  >([]);
  const isControlled = controlledSelectedIds !== undefined;
  const currentSelectedIds = isControlled
    ? controlledSelectedIds
    : internalSelectedIds;
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
  const getRowId = useCallback((row: any, index: number) => {
    return "id" in row ? row.id : "uuid" in row ? row.uuid : index;
  }, []);

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

  // View Switcher Component
  const ViewSwitcher = (
    <div className="flex items-center p-1 bg-gray-100 dark:bg-white/5 rounded-lg">
      <button
        onClick={() => setViewMode("table")}
        className={`p-1.5 rounded-md transition-all ${
          viewMode === "table"
            ? "bg-white dark:bg-white/10 shadow-sm text-blue-600"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="Table View"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => setViewMode("grid")}
        className={`p-1.5 rounded-md transition-all ${
          viewMode === "grid"
            ? "bg-white dark:bg-white/10 shadow-sm text-blue-600"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
        title="Grid View"
      >
        <LayoutGrid size={18} />
      </button>
    </div>
  );

  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[gridCols];

  return (
    <div className="space-y-4">
      <FilterBar
        tableTitle={tableTitle}
        handleCreate={handleCreate}
        baseNamePermission={baseNamePermission}
        enableSelection={enableSelection}
        currentSelectedIds={currentSelectedIds}
        selectionActions={selectionActions}
        searchableKeys={searchableKeys}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        newFilterComponent={newFilterComponent}
        viewSwitcher={ViewSwitcher}
        statusConfig={statusConfig}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        limit={limit}
        setLimit={setLimit}
        handleExport={handleExport}
        label={label}
      />

      <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block">
          {viewMode === "table" ? (
            <TableList
              loading={loading}
              columns={columns}
              enableSelection={enableSelection}
              hideCheckbox={hideChecbox}
              isAllSelected={isAllSelected}
              handleSelectAll={handleSelectAll}
              sortConfig={sortConfig}
              toggleSort={toggleSort}
              isEmpty={isEmpty}
              isFilteredEmpty={isFilteredEmpty}
              paginatedData={paginatedData}
              page={page}
              limit={limit}
              getRowId={getRowId}
              currentSelectedIds={currentSelectedIds}
              handleSelectRow={handleSelectRow}
              label={label}
            />
          ) : (
            <div className={`grid gap-4 p-5 ${gridColsClass}`}>
              <DataTableCard
                data={paginatedData}
                columns={columns}
                getRowId={(row, index) => getRowId(row, (page - 1) * limit + index)}
                enableSelection={enableSelection}
                selectedIds={currentSelectedIds}
                onSelectRow={handleSelectRow}
                hideCheckbox={hideChecbox}
                isEmpty={isEmpty}
                isFilteredEmpty={isFilteredEmpty}
                label={label}
              />
            </div>
          )}
        </div>

        {/* MOBILE VIEW (Always Card) */}
        <div className="lg:hidden">
          {loading ? (
            <TableCardSkeleton rows={5} />
          ) : isEmpty || isFilteredEmpty ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">
              No {label.toLowerCase()} found.
            </div>
          ) : (
            <DataTableCard
              data={paginatedData}
              columns={columns}
              getRowId={(row, index) => getRowId(row, (page - 1) * limit + index)}
              enableSelection={enableSelection}
              selectedIds={currentSelectedIds}
              onSelectRow={handleSelectRow}
              hideCheckbox={hideChecbox}
            />
          )}
        </div>

        <DataTablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}
