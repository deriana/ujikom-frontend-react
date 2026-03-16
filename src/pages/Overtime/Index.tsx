import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import OvertimesTable from "@/components/tables/Overtime/OvertimeTable";
import ChartOvertime from "@/components/tables/Overtime/ChartOvertime";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { BarChart3, ChevronUp } from "lucide-react";
import type { Overtime as OvertimeType } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Overtime() {
  const [showChart, setShowChart] = useState(false);
  const [overtimeData, setOvertimeData] = useState<OvertimeType[]>([]);

  const isMobile = useIsMobile();

  return (
    <>
      <PageMeta title="Overtime" />
      <PageBreadcrumb pageTitle="Overtime" />
      <div className="space-y-6">
        <ComponentCard 
          title="Overtime Requests"
          headerAction={!isMobile && overtimeData.length > 0 && (
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
          {!isMobile && showChart && overtimeData.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <ChartOvertime data={overtimeData} />
            </div>
          )}
          <OvertimesTable onDataLoaded={setOvertimeData} />
        </ComponentCard>
      </div>
    </>
  );
}
