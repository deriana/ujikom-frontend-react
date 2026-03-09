import Checkbox from "@/components/form/input/Checkbox";
import { Column } from "@/types";

interface DataTableCardProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T, index: number) => string | number;
  enableSelection?: boolean;
  selectedIds?: (string | number)[];
  onSelectRow?: (id: string | number) => void;
  page?: number;
  limit?: number;
  hideCheckbox?: boolean;
}

export function DataTableCard<T>({
  data,
  columns,
  getRowId,
  enableSelection,
  selectedIds = [],
  onSelectRow,
  page = 1,
  limit = 10,
  hideCheckbox = false,
}: DataTableCardProps<T>) {
  // 1. Cari kolom aksi (biasanya header berisi 'Action' atau 'Aksi')
  const actionColumn = columns.find(
    (col) =>
      col.header?.toString().toLowerCase().includes("action") ||
      col.header?.toString().toLowerCase().includes("aksi")
  );

  // 2. Filter kolom sisanya untuk ditampilkan di body
  const bodyColumns = columns.filter((col) => col !== actionColumn);

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50/50 dark:bg-transparent">
      {data.map((row, index) => {
        const id = getRowId(row, index);
        const isSelected = selectedIds.includes(id);
        const globalIndex = (page - 1) * limit + index + 1;

        return (
          <div
            key={id}
            className={`relative p-5 bg-white dark:bg-white/5 border rounded-2xl shadow-sm transition-all ${
              isSelected
                ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30"
                : "border-gray-200 dark:border-white/10"
            }`}
          >
            {/* HEADER CARD: Index, Checkbox, & Actions */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                {enableSelection && !hideCheckbox && (
                  <Checkbox
                    checked={isSelected}
                    // FIX ERROR: Gunakan Optional Chaining atau check manual
                    onChange={() => onSelectRow?.(id)} 
                    className="w-5 h-5 text-blue-600 rounded border-gray-300"
                  />
                )}
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                  #{globalIndex}
                </span>
              </div>

              {/* ACTION DI ATAS */}
              {actionColumn && (
                <div className="flex items-center">
                  {actionColumn.render
                    ? actionColumn.render(row)
                    : (row as any)[actionColumn.accessor!] ?? "-"}
                </div>
              )}
            </div>

            {/* BODY CARD: List Data */}
            <div className="space-y-3">
              {bodyColumns.map((col, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 border-b last:border-0 border-gray-50 dark:border-white/5 pb-2 last:pb-0"
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {col.header}
                  </span>
                  <div className="text-sm text-gray-800 dark:text-gray-200 wrap-break-word font-medium">
                    {col.render
                      ? col.render(row)
                      : (row as any)[col.accessor!] ?? "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}