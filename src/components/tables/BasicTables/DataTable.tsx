import { TableCardSkeleton } from "@/components/skeleton/TableCardSkeleton";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Column } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
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
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
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

  const isMobile = useIsMobile();

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
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      {/* FILTER BAR */}
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
        statusConfig={statusConfig}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        limit={limit}
        setLimit={setLimit}
        handleExport={handleExport}
        label={label}
      />

      {/* TABLE */}
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

      {isMobile && loading && (
        <div className="lg:hidden">
          <TableCardSkeleton rows={5} />
        </div>
      )}

      {isMobile && !loading && (isEmpty || isFilteredEmpty) && (
        <div className="lg:hidden px-5 py-10 text-center text-sm text-gray-500 border-t dark:border-white/10">
          {isEmpty
            ? `No ${label.toLowerCase()} available.`
            : `No matching ${label.toLowerCase()} found.`}
        </div>
      )}

      {isMobile && !loading && !isEmpty && !isFilteredEmpty && (
        <div className="lg:hidden border-t dark:border-white/10">
          <DataTableCard
            data={paginatedData}
            columns={columns}
            getRowId={(row, index) => getRowId(row, (page - 1) * limit + index)}
            enableSelection={enableSelection}
            selectedIds={currentSelectedIds}
            onSelectRow={handleSelectRow}
            hideCheckbox={hideChecbox}
          />
        </div>
      )}

      {/* PAGINATION */}
      <DataTablePagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
