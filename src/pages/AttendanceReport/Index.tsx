import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceTable from "@/components/tables/Attendance/AttendanceTable";
import AttendanceLogTable from "@/components/tables/Attendance/AttendanceLogTable";
import ChartAttendance from "@/components/tables/Attendance/ChartAttendance";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import Button from "@/components/ui/button/Button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Attendance } from "@/types";
import { useRoleName } from "@/hooks/useRoleName";
import { ROLES } from "@/constants/Roles";
import { ChevronUp, BarChart3, History, Table as TableIcon } from "lucide-react";
import { useState } from "react";

export default function AttendancesReport() {
  const [showChart, setShowChart] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isMobile = useIsMobile();
  const { isRole } = useRoleName();

  return (
    <>
      <PageMeta title="Attendances" />
      <PageBreadcrumb pageTitle="Attendances" />

      <div className="space-y-6">
        <ComponentCard
          title="Attendances Page"
          headerAction={
            <div className="flex items-center gap-2">
              {!isMobile && !showLogs && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChart(!showChart)}
                  className="flex items-center gap-2"
                >
                  {showChart ? (
                    <>
                      <ChevronUp size={16} /> Hide Analytics
                    </>
                  ) : (
                    <>
                      <BarChart3 size={16} /> Show Analytics
                    </>
                  )}
                </Button>
              )}
              {isRole(ROLES.ADMIN) && (
                <Button
                  variant={showLogs ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    setShowLogs(!showLogs);
                    if (!showLogs) setShowChart(false);
                  }}
                  className="flex items-center gap-2"
                >
                  {showLogs ? (
                    <>
                      <TableIcon size={16} /> Show Report
                    </>
                  ) : (
                    <>
                      <History size={16} /> View Logs
                    </>
                  )}
                </Button>
              )}
            </div>
          }
        >
          {showChart && !showLogs && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              {isDataLoading ? (
                <ChartSkeleton />
              ) : (
                attendanceData.length > 0 && <ChartAttendance data={attendanceData} />
              )}
            </div>
          )}

          {showLogs ? (
            <AttendanceLogTable />
          ) : (
            <AttendanceTable
              onDataLoaded={(data) => {
                setAttendanceData(data);
                setIsDataLoading(false);
              }}
              onLoading={(loading) => setIsDataLoading(loading)}
            />
          )}
        </ComponentCard>
      </div>
    </>
  );
}