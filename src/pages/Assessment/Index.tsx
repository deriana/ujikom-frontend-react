import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import AssessmentsTable from "@/components/tables/Assessments/AssessmentTable";

export default function AssessmentPage() {
  return (
    <>
      <PageMeta title="Assessment" />
      <PageBreadcrumb pageTitle="Assessment" />
      <div className="space-y-6">
        <ComponentCard title="Assessment Page">
            <AssessmentsTable />
        </ComponentCard>
      </div>
    </>
  );
}
