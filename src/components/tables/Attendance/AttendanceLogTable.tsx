import { DataTable } from "@/components/tables/BasicTables/DataTable";
import Badge from "@/components/ui/badge/Badge";
import { useAttendanceLogs } from "@/hooks/useAttendance";
import { AttendanceLogs, Column } from "@/types";
import { formatDateID } from "@/utils/date";
import { MapPin, Monitor, Globe } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "@/components/form/date-picker";

export default function AttendanceLogTable() {
  const today = new Date().toISOString().split("T")[0];
  const [dateFilter, setDateFilter] = useState<string>(today);

  const {
    data: attendances = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAttendanceLogs({ date: dateFilter });
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (dateFilter) {
      refetch();
    }
  }, [dateFilter, refetch]);

  useEffect(() => {
    if (isMobile) {
      navigate(-1);
    }
  }, [isMobile, navigate]);

  const columns: Column<AttendanceLogs>[] = [
    {
      header: "Employee",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white/90 capitalize leading-tight">
            {row.employee.name || "-"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
            NIK: {row.employee.nik || "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Time",
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {formatDateID(row.created_at)}
          </span>
          <span className="text-[10px] text-gray-400">{row.time_ago}</span>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => {
        const isSuccess = row.status?.toLowerCase() === "present" || row.status?.toLowerCase() === "success";
        return (
          <Badge
            size="sm"
            variant="light"
            color={isSuccess ? "success" : "error"}
          >
            {row.status?.toUpperCase() || "-"}
          </Badge>
        );
      },
    },
    {
      header: "Action",
      render: (row) => (
        <Badge variant="light" size="sm">
          {row.action.replace("_", " ").toUpperCase()}
        </Badge>
      ),
    },
   {
  header: "Similarity",
  render: (row) => (
    <span
      className={`font-mono font-bold ${
        (row.similarity_score ?? 0) > 0.8 ? "text-emerald-600" : "text-amber-600"
      }`}
    >
      {((row.similarity_score ?? 0) * 100).toFixed(1)}%
    </span>
  ),
},
    {
      header: "Metadata",
      render: (row) => (
        <div className="flex flex-col gap-1 text-[10px]">
          <div className="flex items-center gap-1 text-gray-500">
            <Globe size={12} /> {row.ip_address}
          </div>
          <div
            className="flex items-center gap-1 text-gray-500 truncate max-w-37.5"
            title={row.user_agent}
          >
            <Monitor size={12} /> {row.user_agent}
          </div>
        </div>
      ),
    },
    {
      header: "Location",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
          <MapPin size={14} />
          <a
            href={`https://www.google.com/maps?q=${row.location.latitude},${row.location.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            View Map
          </a>
        </div>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
        <span className="font-bold">Error:</span> {(error as Error).message}
      </div>
    );
  }

  return (
    <>
      <DataTable
        tableTitle="Attendances Logs"
        data={attendances}
        columns={columns}
        searchableKeys={[
          "employee.name",
          "employee.nik",
          "ip_address",
          "action",
        ]}
        loading={isLoading}
        label="Attendance Log"
        newFilterComponent={
          <DatePicker
            id="log-date-filter"
            mode="single"
            placeholder="Filter by date"
            value={dateFilter}
            onChange={(dates) => {
              if (dates.length > 0) {
                const date = dates[0];
                const localDate = date.toLocaleDateString("en-CA");
                setDateFilter(localDate);
              }
            }}
          />
        }
      />
    </>
  );
}
