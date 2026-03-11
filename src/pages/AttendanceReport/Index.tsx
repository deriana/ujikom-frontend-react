import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceTable from "@/components/tables/Attendance/AttendanceTable";
import ChartAttendance from "@/components/tables/Attendance/ChartAttendance";
import ChartSkeleton from "@/components/skeleton/ChartSkeleton";
import Button from "@/components/ui/button/Button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Attendance } from "@/types";
import { ChevronUp, BarChart3 } from "lucide-react";
import { useState } from "react";

export default function AttendancesReport() {
  const [showChart, setShowChart] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const isMobile = useIsMobile();

  return (
    <>
      <PageMeta title="Attendances" />
      <PageBreadcrumb pageTitle="Attendances" />

      <div className="space-y-6">
        <ComponentCard
          title="Attendances Page"
          headerAction={
            !isMobile && (
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
            )
          }
        >
          {/* PERBAIKAN: Gunakan showChart di sini agar analytics benar-benar bisa di-toggle */}
          {showChart && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              {isDataLoading ? (
                <ChartSkeleton />
              ) : (
                attendanceData.length > 0 && <ChartAttendance data={attendanceData} />
              )}
            </div>
          )}

          <AttendanceTable
            onDataLoaded={(data) => {
              setAttendanceData(data);
              setIsDataLoading(false);
            }}
            onLoading={(loading) => setIsDataLoading(loading)}
          />
        </ComponentCard>
      </div>
    </>
  );
}