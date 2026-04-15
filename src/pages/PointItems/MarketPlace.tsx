import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointItems, useRedeemPointItem } from "@/hooks/usePointItem";
import { 
  Star} from "lucide-react";
import PointItemShowModal from "./ShowModal";
import { handleMutation } from "@/utils/handleMutation";
import { useIsMobile } from "@/hooks/useIsMobile";
import RedeemModal from "@/components/tables/Point/RedeemModal";
import EmptyState from "@/components/tables/Point/EmptyState";
import GridLayout from "@/components/tables/Point/GridLayout";
import CategoriesMarketplace from "@/components/tables/Point/CategoriesMarketplace";
import HeaderMarketplace from "@/components/tables/Point/HeaderMarketplace";

export default function PointMarketplace() {
  const { data: items = [], isLoading } = usePointItems();
  const { mutateAsync: redeem, isPending: isRedeeming } = useRedeemPointItem();
  const isMobile = useIsMobile();
  
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [redeemItemUuid, setRedeemItemUuid] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const itemToRedeem = useMemo(() => 
    items.find(i => i.uuid === redeemItemUuid), 
    [items, redeemItemUuid]
  );

  const filteredItems = items.filter(item => 
    item.is_active && 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <div className={`min-h-screen  ${isMobile ? 'pb-24' : 'p-6'}`}>
        {/* Header Section */}
        <HeaderMarketplace searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Categories / Filters */}
        <CategoriesMarketplace  activeCategory="All" onCategoryChange={() => {}} />

        {/* Grid Layout */}
          <GridLayout filteredItems={filteredItems} isLoading={isLoading} setQuantity={setQuantity} setSelectedItem={setSelectedItem} setRedeemItemUuid={setRedeemItemUuid} />

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
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

        {/* Floating Action for Mobile (Points Balance) */}
        {isMobile && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
              <div className="bg-amber-400 p-1 rounded-full">
                <Star size={14} className="text-gray-900 fill-gray-900" />
              </div>
              <span className="text-sm font-black tracking-tight">Your Balance: 2,450 Pts</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
