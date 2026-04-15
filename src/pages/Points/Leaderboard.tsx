import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import PointLeaderboardTable from "@/components/tables/Point/PointLeaderboardTable";

export default function PointLeaderboard() {
  return (
    <>
      <PageMeta title="Point Leaderboard" />
      <PageBreadcrumb pageTitle="Point Leaderboard" />
      <div className="space-y-6">
        <ComponentCard title="Point Leaderboard Page">
            <PointLeaderboardTable />
        </ComponentCard>
      </div>
    </>
  );
}
