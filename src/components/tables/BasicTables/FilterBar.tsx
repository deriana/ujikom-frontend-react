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
}: FilterBarProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-b border-gray-100 dark:border-white/5 lg:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-between flex-1 lg:flex-none">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {tableTitle}
            </h3>

            {isMobile && handleCreate && (
              <Can
                value={buildPermission(
                  baseNamePermission!,
                  PERMISSIONS.BASE.CREATE,
                )}
              >
                <button
                  onClick={handleCreate}
                  className="p-2 ml-2 text-blue-600 transition bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  <Plus size={20} />
                </button>
              </Can>
            )}
          </div>

          {enableSelection && currentSelectedIds.length > 0 && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
              {currentSelectedIds.length} {isMobile ? "" : "Selected"}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {enableSelection &&
            currentSelectedIds.length > 0 &&
            selectionActions && (
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

          {newFilterComponent && (
            <div
              className={
                isMobile
                  ? "grid grid-cols-2 gap-3 [&>*:last-child:nth-child(odd)]:col-span-2"
                  : "contents"
              }
            >
              {newFilterComponent}
            </div>
          )}

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
            options={[5, 10, 20, 30, 40, 50].map((n) => ({
              label: `Show ${n}`,
              value: String(n),
            }))}
            searchable={false}
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
                  className="inline-flex items-center justify-center gap-2 px-4 h-11 lg:h-9.5 w-full sm:w-auto text-sm font-medium text-white transition bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <Download size={16} />
                  <span className="sm:hidden">Export {label}</span>
                </button>
              </Tooltip>
            </Can>
          )}
          {!isMobile && handleCreate && (
            <Can
              value={buildPermission(
                baseNamePermission!,
                PERMISSIONS.BASE.CREATE,
              )}
            >
              <Tooltip content={`Create ${label}`} position="bottom">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center justify-center gap-2 px-4 h-11 lg:h-9.5 w-full sm:w-auto text-sm font-medium text-gray-700 transition bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-white/5 dark:border-white/10 dark:text-white/90 dark:hover:bg-white/10"
                >
                  <Plus size={16} className="text-blue-600 dark:text-blue-400" />
                  <span className="sm:hidden">Create {label}</span>
                </button>
              </Tooltip>
            </Can>
          )}
        </div>
      </div>
  );
}