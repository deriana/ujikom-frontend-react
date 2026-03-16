import React from "react";
import { Plus, Download } from "lucide-react";
import { Can } from "@/components/auth/Can";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import FilterDropdown from "@/components/FilterDropdown";
import Tooltip from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useIsMobile";

interface FilterBarProps {
  tableTitle: string;
  isMobile?: boolean;
  handleCreate?: () => void;
  baseNamePermission?: string;
  enableSelection?: boolean;
  currentSelectedIds: (string | number)[];
  selectionActions?: (selectedIds: (string | number)[]) => React.ReactNode;
  searchableKeys: any[];
  search: string;
  setSearch: (val: string) => void;
  setPage: (val: number) => void;
  newFilterComponent?: React.ReactNode;
  statusConfig?: {
    key: string;
    options: { label: string; value: string }[];
  };
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  limit: number;
  setLimit: (val: number) => void;
  handleExport?: () => void;
  label: string;
  viewSwitcher?: React.ReactNode;
}

export function FilterBar({
  tableTitle,
  handleCreate,
  baseNamePermission,
  enableSelection,
  currentSelectedIds,
  selectionActions,
  searchableKeys,
  search,
  setSearch,
  setPage,
  newFilterComponent,
  statusConfig,
  statusFilter,
  setStatusFilter,
  limit,
  setLimit,
  handleExport,
  label,
  viewSwitcher,
}: FilterBarProps) {
  const isMobile = useIsMobile();

  const limitOptions = [5, 10, 20, 30, 40, 50].map((n) => ({
    label: `Show ${n}`,
    value: String(n),
  }));

  const statusOptions = statusConfig 
    ? [{ label: "All Status", value: "all" }, ...statusConfig.options] 
    : [];

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5 lg:px-5 lg:flex-row lg:items-center lg:justify-between">
      
      {/* KIRI: Title & Search Group */}
      <div className="flex flex-col gap-3 w-full lg:w-auto lg:flex-row lg:items-center">
        <div className="flex items-center justify-between lg:justify-start gap-3 lg:border-r lg:pr-4 lg:border-gray-200 lg:dark:border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90 whitespace-nowrap">
              {tableTitle}
            </h3>
            {enableSelection && currentSelectedIds.length > 0 && (
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20">
                {currentSelectedIds.length} {isMobile ? "" : "Selected"}
              </span>
            )}
            {!isMobile && (
              <div className="flex items-center gap-2">
                {viewSwitcher}
              </div>
            )}

          </div>

          {isMobile && (
            <div className="flex items-center gap-2">
              {handleExport && (
                <Can value={buildPermission(baseNamePermission!, PERMISSIONS.BASE.EXPORT)}>
                  <button
                    onClick={handleExport}
                    className="p-2 text-emerald-600 transition bg-emerald-50 rounded-lg hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400"
                  >
                    <Download size={20} />
                  </button>
                </Can>
              )}
              {handleCreate && (
                <Can value={buildPermission(baseNamePermission!, PERMISSIONS.BASE.CREATE)}>
                  <button
                    onClick={handleCreate}
                    className="p-2 text-blue-600 transition bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                  >
                    <Plus size={20} />
                  </button>
                </Can>
              )}
            </div>
          )}
        </div>

        {/* SEARCH & LIMIT GROUP */}
        <div className="flex flex-col gap-2 w-full sm:max-w-xs lg:flex-row lg:items-center lg:max-w-none">
          {searchableKeys.length > 0 && (
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full px-3 py-2 text-sm border dark:text-gray-300 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:border-white/10 lg:w-60"
            />
          )}
          <div className="w-full sm:w-32 lg:w-36">
            <FilterDropdown
              value={String(limit)}
              onChange={(val) => { setLimit(Number(val)); setPage(1); }}
              options={limitOptions}
              searchable={false}
            />
          </div>
        </div>
      </div>

      {/* KANAN: Filters & Action Buttons */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end flex-1">
        
        {/* ROW 2: Custom Filters (Status, etc) - Moved before actions for alignment */}
        <div className={`flex flex-wrap items-center justify-end gap-2 ${isMobile ? "grid grid-cols-2" : ""}`}>
          {statusConfig && (
            <FilterDropdown
              value={statusFilter}
              onChange={(val) => { setStatusFilter(val); setPage(1); }}
              options={statusOptions}
            />
          )}

          {newFilterComponent && (
            <div className={isMobile ? "contents" : "flex items-center gap-2"}>
              {newFilterComponent}
            </div>
          )}
        </div>

        {/* ROW 1: Action Buttons (Export/Create) */}
        <div className="flex items-center justify-end gap-2 lg:border-l lg:pl-3 lg:border-gray-200 lg:dark:border-white/10">
          {enableSelection && currentSelectedIds.length > 0 && selectionActions && (
            <div className="flex items-center gap-2 pr-2 border-r border-gray-200 dark:border-gray-700">
              {selectionActions(currentSelectedIds)}
            </div>
          )}
          
          {!isMobile && handleExport && (
            <Can value={buildPermission(baseNamePermission!, PERMISSIONS.BASE.EXPORT)}>
              <Tooltip content={`Export ${label}`} position="bottom">
                <button
                  onClick={handleExport}
                  className="inline-flex items-center justify-center gap-2 px-3 h-9 lg:h-9.5 text-sm font-medium text-white transition bg-emerald-600 rounded-lg hover:bg-emerald-700"
                >
                  <Download size={16} />
                  <span className="hidden xl:inline">Export</span>
                </button>
              </Tooltip>
            </Can>
          )}

          {!isMobile && handleCreate && (
            <Can value={buildPermission(baseNamePermission!, PERMISSIONS.BASE.CREATE)}>
              <Tooltip content={`Create ${label}`} position="bottom">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center justify-center gap-2 px-3 h-9 lg:h-9.5 text-sm font-medium text-gray-700 transition bg-white border border-gray-200 rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white/90"
                >
                  <Plus size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="hidden xl:inline">Create</span>
                </button>
              </Tooltip>
            </Can>
          )}
        </div>
      </div>
    </div>
  );
}