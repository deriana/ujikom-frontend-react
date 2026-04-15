import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointItems, useRedeemPointItem, usePointWallet } from "@/hooks/usePointItem";
import PointItemShowModal from "./ShowModal";
import { handleMutation } from "@/utils/handleMutation";
import { useIsMobile } from "@/hooks/useIsMobile";
import RedeemModal from "@/components/tables/Point/RedeemModal";
import EmptyState from "@/components/tables/Point/EmptyState";
import GridLayout from "@/components/tables/Point/GridLayout";
import CategoriesMarketplace from "@/components/tables/Point/CategoriesMarketplace";
import HeaderMarketplace from "@/components/tables/Point/HeaderMarketplace";
import WalletInfoDetail from "@/components/tables/Point/WalletInfoDetail";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PointBalanceSummary, PointItemCategory } from "@/types";

export default function PointMarketplace() {
  const { data: items = [], isLoading: isItemsLoading } = usePointItems();
  const { mutateAsync: redeem, isPending: isRedeeming } = useRedeemPointItem();
  const isMobile = useIsMobile();
  const { data: wallet, isLoading: isWalletLoading } = usePointWallet() as { 
    data: PointBalanceSummary | undefined, 
    isLoading: boolean 
  };
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [redeemItemUuid, setRedeemItemUuid] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PointItemCategory>("All" as PointItemCategory);

  const itemToRedeem = useMemo(() => 
    items.find(i => i.uuid === redeemItemUuid), 
    [items, redeemItemUuid]
  );

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.is_active && 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      ((activeCategory as string) === "All" || item.category === activeCategory)
    );
  }, [items, searchQuery, activeCategory]);

  const handleRedeem = () => {
    if (!redeemItemUuid) return;
    handleMutation(() => redeem({ uuid: redeemItemUuid, quantity }), {
      loading: "Processing redemption...",
      success: "Item redeemed successfully! Check your inventory.",
      error: "Failed to redeem item",
      onSuccess: () => setRedeemItemUuid(null),
    });
  };

  return (
    <>
      <PageMeta title="Integrity Marketplace" />
            <PageBreadcrumb pageTitle="Point Marketplace" />

      <div className={`min-h-screen  ${isMobile ? 'pb-24' : 'p-6'}`}>
        {/* Header Section */}
        <HeaderMarketplace searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Categories / Filters */}
        <CategoriesMarketplace activeCategory={activeCategory} onCategoryChange={(cat) => setActiveCategory(cat as PointItemCategory)} />

        {/* Grid Layout */}
          <GridLayout 
            filteredItems={filteredItems} 
            isLoading={isItemsLoading} 
            userBalance={wallet?.current_balance || 0}
            setQuantity={setQuantity} 
            setSelectedItem={setSelectedItem} 
            setRedeemItemUuid={setRedeemItemUuid} 
          />

        {/* Empty State */}
        {!isItemsLoading && filteredItems.length === 0 && (
            <EmptyState />
        )}

        {/* Detail Modal */}
        <PointItemShowModal 
          uuid={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        {/* Redemption Confirmation Modal */}
        <RedeemModal 
          isOpen={!!redeemItemUuid}
          onClose={() => setRedeemItemUuid(null)}
          item={itemToRedeem}
          quantity={quantity}
          setQuantity={setQuantity}
          onConfirm={handleRedeem}
          isRedeeming={isRedeeming}
        />

        {/* Floating Point Wallet Info */}
        <WalletInfoDetail wallet={wallet} isLoading={isWalletLoading} />
      </div>
    </>
  );
}
