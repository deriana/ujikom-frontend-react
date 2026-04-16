import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SystemLogTable from "@/components/tables/Log/LogTable";

export default function SystemLogs() {
  return (
    <>
      <PageMeta title="System Logs" />
      <PageBreadcrumb pageTitle="System Logs" />
      <div className="space-y-6">
        <ComponentCard title="System Logs Page">
            <SystemLogTable />
        </ComponentCard>
      </div>
    </>
  );
}
