import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import LeavesTable from "@/components/tables/Leaves/LeavesTable";
import ChartLeave from "@/components/tables/Leaves/ChartLeave"; // Pastikan import ini
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import { BarChart3, ChevronUp } from "lucide-react";
import type { Leave } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Leave() {
  const [showChart, setShowChart] = useState(false);
  const [leaveData, setLeaveData] = useState<Leave[]>([]);

  const isMobile = useIsMobile();

  return (
    <>
      <PageMeta title="Leave" />
      <PageBreadcrumb pageTitle="Leave" />

      <div className="space-y-6">
        <ComponentCard
          title="Leave Requests"
          headerAction={!isMobile && leaveData.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="flex items-center gap-2"
              >
                {showChart ? (
                  <>
                    {" "}
                    <ChevronUp size={16} /> Hide Analytics{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <BarChart3 size={16} /> Show Analytics{" "}
                  </>
                )}
              </Button>
            )
          }
        >
          {!isMobile && showChart && leaveData.length > 0 && (
            <div className="mb-8 pb-8 border-b border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
              <ChartLeave leaves={leaveData} />
              <hr className="mt-8 border-gray-800 dark:text-gray-100" />
            </div>
          )}

          <LeavesTable onDataLoaded={setLeaveData} />
        </ComponentCard>
      </div>
    </>
  );
}
