import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointMutations } from "@/hooks/usePointItem";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PointMutation } from "@/types";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MutationHeader from "@/components/tables/Point/MutationHeader";
import MutationFilter from "@/components/tables/Point/MutationFilter";
import MutationList from "@/components/tables/Point/MutationList";

export default function PointMutations() {
  const { data: mutations = [] as PointMutation[], isLoading } = usePointMutations();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "incoming" | "outgoing">("ALL");

  const filteredMutations = useMemo(() => {
    return mutations.filter((m) => {
      const matchesSearch = m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "ALL" ? true : m.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [mutations, searchQuery, filter]);

  const totalEarned = mutations.filter(m => m.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = Math.abs(mutations.filter(m => m.amount < 0).reduce((acc, curr) => acc + curr.amount, 0));

  return (
    <>
      <PageMeta title="Point History" />
      <PageBreadcrumb pageTitle="Point Mutations" />

      <div className={`min-h-screen ${isMobile ? 'pb-24' : 'p-8'}`}>
        {/* Header Section */}
        <MutationHeader totalEarned={totalEarned} totalSpent={totalSpent} />

        {/* Filters & Search */}
        <MutationFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} filter={filter} setFilter={setFilter} />

        {/* Mutation List */}
        <MutationList isLoading={isLoading} filteredMutations={filteredMutations} />
      </div>
    </>
  );
}
