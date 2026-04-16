import { useState } from "react";
import PageHeader from "@/components/Mobile/PageHeader";
import { usePointWallet } from "@/hooks/usePointItem";
import { PointBalanceSummary } from "@/types";
import BenefitModal from "@/components/tables/Point/BenefitModal";
import UrgencyBanner from "@/components/tables/Point/UrgencyBanner";
import MobileBentoGrid from "@/components/tables/Point/MobileBentoGrid";
import MobileHero from "@/components/tables/Point/MobileHero";
import { calculateRankProgress, getRankInfo } from "@/constants/Rank";

export default function WalletHome() {
  const [showBenefits, setShowBenefits] = useState(false);
  const { data: wallet, isLoading } = usePointWallet() as {
    data: PointBalanceSummary | undefined;
    isLoading: boolean;
  };

  const rank = getRankInfo(wallet?.total_earned || 0);
  const progress = calculateRankProgress(wallet?.total_earned || 0);

  console.log("Wallet Data in WalletHome:", wallet);

  const balance = wallet?.current_balance || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-500">
      <PageHeader title="Integrity Wallet" subtitle="Loyalty & Performance" />

      <main className="px-5 space-y-8 mt-4">
        {/* HERO SECTION: THE WALLET CARD */}
        <MobileHero wallet={wallet} isLoading={isLoading} rank={rank} progress={progress} balance={balance} setShowBenefits={setShowBenefits} />

        {/* BENTO GRID: SERVICES */}
        <MobileBentoGrid />

        {/* GAMIFICATION BANNER: URGENCY */}
        <UrgencyBanner wallet={wallet} />
      </main>

      <BenefitModal isOpen={showBenefits} onClose={() => setShowBenefits(false)} />
    </div>
  );
}
