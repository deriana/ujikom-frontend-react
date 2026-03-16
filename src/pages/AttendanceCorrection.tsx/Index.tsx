import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AttendanceCorrectionTable from "@/components/tables/Attendance/AttendanceCorrectionTable";

export default function AttendancCorrections() {
  return (
    <>
      <PageMeta title="Attendance Corrections" />
      <PageBreadcrumb pageTitle="Attendance Corrections" />
      <div className="space-y-6">
        <ComponentCard title="Attendance Corrections Page">
            <AttendanceCorrectionTable />
        </ComponentCard>
      </div>
    </>
  );
}
