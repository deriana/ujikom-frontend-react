import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AssessmentCategoryTable from "@/components/tables/Assessments/AssessmentCategoryTable";

export default function AssessmentCategory() {
  return (
    <>
      <PageMeta title="Assessment Category" />
      <PageBreadcrumb pageTitle="Assessment Category" />
      <div className="space-y-6">
        <ComponentCard title="Assessment Category Page">
            <AssessmentCategoryTable />
        </ComponentCard>
      </div>
    </>
  );
}
