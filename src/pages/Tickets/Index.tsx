import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import TicketsTable from "@/components/tables/Tickets/TicketsTable";

export default function Tickets() {
  return (
    <>
      <PageMeta title="Tickets" />
      <PageBreadcrumb pageTitle="Tickets" />
      <div className="space-y-6">
        <ComponentCard title="Tickets Page">
            <TicketsTable />
        </ComponentCard>
      </div>
    </>
  );
}
