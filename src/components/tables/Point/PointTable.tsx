import { Column, Point } from "@/types";
import { DataTable } from "../BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { ClipboardList, Star } from "lucide-react";
import { usePoint } from "@/hooks/usePoint";
import UserProfile from "@/components/UserProfile";
import { formatDateID } from "@/utils/date";
import { useMemo, useState } from "react";
import FilterDropdown from "@/components/FilterDropdown";

export default function PointTable() {
  const {
    data: points = [],
    isLoading,
    isError,
    error,
  } = usePoint();

  const [typeFilter, setTypeFilter] = useState("all");

  const typeOptions = useMemo(() => {
    return [
      { label: "All Types", value: "all" },
      { label: "Reward", value: "reward" },
      { label: "Penalty", value: "penalty" },
    ];
  }, []);

  const columns: Column<Point>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <UserProfile
            src={row.employee?.photo}
            alt={row.employee?.name}
            size={32}
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {row.employee?.name || "Unknown"}
            </span>
            <span className="text-[10px] text-gray-400 uppercase">
              {row.employee?.nik || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Event",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-400">
            <ClipboardList size={20} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-gray-900 dark:text-gray-100 truncate">
              {row.rule.event_name}
            </span>
            <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
              {row.rule.description || "No description"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Period",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {row.period.name}
          </span>
          <span className="text-[10px] text-gray-400">
            {formatDateID(new Date(row.created_at))}
          </span>
        </div>
      ),
    },
    {
      header: "Type",
      render: (row) => (
        <Badge variant="light" color={row.type === "reward" ? "success" : "error"}>
          <span className="capitalize">{row.type}</span>
        </Badge>
      ),
    },
    {
      header: "Points",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-black">
          <Star
            size={14}
            className={row.type === "reward" ? "text-yellow-500" : "text-red-500"}
          />
          <span
            className={row.type === "reward" ? "text-green-600" : "text-red-600"}
          >
            {row.type === "reward" ? `+${row.points}` : `${row.points}`}
          </span>
        </div>
      ),
    },
  ];

  if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <>
      <DataTable
        tableTitle="Point History Log"
        data={points}
        columns={columns}
        searchableKeys={["employee.name", "rule.event_name"]}
        loading={isLoading}
        extraFilters={{ type: typeFilter }}
        newFilterComponent={
          <FilterDropdown
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
          />
        }
      />
    </>
  );
}