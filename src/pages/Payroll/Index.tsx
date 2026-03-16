import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PayrollTable from "@/components/tables/Payroll/PayrollTable";
import ChartPayroll from "@/components/tables/Payroll/ChartPayroll";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { BarChart3, ChevronUp } from "lucide-react";
import type { Payroll } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Payroll() {
  const [showChart, setShowChart] = useState(false);
  const [payrollData, setPayrollData] = useState<Payroll[]>([]);
  console.log(payrollData);

  const isMobile = useIsMobile();

  return (
    <>
      <PageMeta title="Payroll" />
      <PageBreadcrumb pageTitle="Payroll" />
      <div className="space-y-6">
        <ComponentCard 
          title="Payroll Management"
          headerAction={!isMobile && payrollData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-2"
            >
              {showChart ? (
                <> <ChevronUp size={16} /> Hide Analytics </>
              ) : (
                <> <BarChart3 size={16} /> Show Analytics </>
              )}
            </Button>
          )}
        >
          {!isMobile && showChart && payrollData.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <ChartPayroll data={payrollData} />
            </div>
          )}
          <PayrollTable onDataLoaded={setPayrollData} />
        </ComponentCard>
      </div>
    </>
  );
}
