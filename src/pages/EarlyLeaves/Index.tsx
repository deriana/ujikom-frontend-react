import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import EarlyLeavesTable from "@/components/tables/EarlyLeaves/EarlyLeavesTable";
import ChartEarlyLeaves from "@/components/tables/EarlyLeaves/ChartEarlyLeaves";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { BarChart3, ChevronUp } from "lucide-react";
import type { EarlyLeave } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function EarlyLeaves() {
  const [showChart, setShowChart] = useState(false);
  const [earlyLeaveData, setEarlyLeaveData] = useState<EarlyLeave[]>([]);

  const isMobile = useIsMobile();

  return (
    <>
      <PageMeta title="Early Leaves" />
      <PageBreadcrumb pageTitle="Early Leaves" />
      <div className="space-y-6">
        <ComponentCard 
          title="Early Leave Requests"
          headerAction={!isMobile && earlyLeaveData.length > 0 && (
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
          {!isMobile && showChart && earlyLeaveData.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <ChartEarlyLeaves data={earlyLeaveData} />
            </div>
          )}
          <EarlyLeavesTable onDataLoaded={setEarlyLeaveData} />
        </ComponentCard>
      </div>
    </>
  );
}
