import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointInventories, useUsePointItem } from "@/hooks/usePointItem";
import PointItemShowModal from "./ShowModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import EmptyState from "@/components/tables/Point/EmptyState";
import { useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";
import WalletInfoDetail from "@/components/tables/Point/WalletInfoDetail";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ConfirmationModalInventory from "@/components/tables/Point/ConfirmationModalInventory";
import GridLayoutInventory from "@/components/tables/Point/GridLayoutInventory";
import InventoryHeader from "@/components/tables/Point/InventoryHeader";

export default function PointInventories() {
  const { data: items = [], isLoading } = usePointInventories();
  const { mutateAsync: useItem, isPending: isUsing } = useUsePointItem();
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState("");
  const show = useShowModal<string>();
  const [confirmUseUuid, setConfirmUseUuid] = useState<string | null>(null);

  const filteredItems = useMemo(() => 
    items.filter(item => 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [items, searchQuery]);

  const handleUseItem = (uuid: string) => {
    handleMutation(() => useItem(uuid), {
      loading: "Activating item...",
      success: "Item used successfully!",
      error: "Failed to use item",
      onSuccess: () => setConfirmUseUuid(null),
    });
  };

  return (
    <>
      <PageMeta title="My Inventories" />
      <PageBreadcrumb pageTitle="My Inventories" />

      <div className={`min-h-screen ${isMobile ? 'pb-24' : 'p-8'}`}>
        {/* Gamified Inventory Header */}
        <InventoryHeader searchQuery={searchQuery} itemCount={items.length} setSearchQuery={setSearchQuery} />
       

        {/* Grid Layout */}
        <GridLayoutInventory filteredItems={filteredItems} isLoading={isLoading} isUsing={isUsing} onShowDetail={show.open} onUseItem={setConfirmUseUuid} />
        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
            <EmptyState />
        )}

        {/* Floating Point Wallet Info */}
        <WalletInfoDetail />
       

        {/* Confirmation Modal */}
        <ConfirmationModalInventory 
          isOpen={!!confirmUseUuid}
          onClose={() => setConfirmUseUuid(null)}
          onConfirm={() => handleUseItem(confirmUseUuid as string)}
          isUsing={isUsing}
        />
     
        {/* Detail Modal */}
        <PointItemShowModal 
          uuid={show.showId}
          isOpen={show.isOpen}
          onClose={show.close}
        />
      </div>
    </>
  );
}
