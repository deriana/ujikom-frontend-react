import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DivisionTable from "@/components/tables/Divisions/DivisionsTable";
import PageAlertOutlet from "@/components/ui/alert/PageAlertOutlet";
import { PageAlertProvider } from "@/context/PageAlertContext";

export default function Divisions() {
  return (
    <PageAlertProvider>
      <PageMeta title="Divisions" />
      <PageBreadcrumb pageTitle="Divisions" />

      <div className="space-y-6">
        <ComponentCard title="Divisions Page">

          <PageAlertOutlet />

          <DivisionTable />
        </ComponentCard>
      </div>
    </PageAlertProvider>
  );
}
