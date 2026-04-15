import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PointRuleTable from "@/components/tables/Point/PointRuleTable";

export default function PointRule() {
  return (
    <>
      <PageMeta title="Point Rule" />
      <PageBreadcrumb pageTitle="Point Rule" />
      <div className="space-y-6">
        <ComponentCard title="Point Rule Page">
            <PointRuleTable />
        </ComponentCard>
      </div>
    </>
  );
}
