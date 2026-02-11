import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import HolidaysTable from "@/components/tables/Holidays/HolidaysTable";

export default function Holidays() {
  return (
    <>
      <PageMeta title="Holidays" />
      <PageBreadcrumb pageTitle="Holidays" />
      <div className="space-y-6">
        <ComponentCard title="Holidays Page">
            <HolidaysTable />
        </ComponentCard>
      </div>
    </>
  );
}
