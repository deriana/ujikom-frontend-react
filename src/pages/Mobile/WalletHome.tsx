import { useState } from "react";
import PageHeader from "@/components/Mobile/PageHeader";
import { usePointWallet } from "@/hooks/usePointItem";
import { PointBalanceSummary } from "@/types";
import BenefitModal from "@/components/tables/Point/BenefitModal";
import UrgencyBanner from "@/components/tables/Point/UrgencyBanner";
import MobileBentoGrid from "@/components/tables/Point/MobileBentoGrid";
import MobileHero from "@/components/tables/Point/MobileHero";

export default function WalletHome() {
  const [showBenefits, setShowBenefits] = useState(false);
  const { data: wallet, isLoading } = usePointWallet() as {
    data: PointBalanceSummary | undefined;
    isLoading: boolean;
  };

  const getRankInfo = (points: number) => {
    if (points >= 10000)
      return { name: "Discipline Legend", level: 50, min: 10000, next: 20000 };
    if (points >= 5000)
      return { name: "Discipline Elite", level: 25, min: 5000, next: 10000 };
    if (points >= 2500)
      return { name: "Discipline Master", level: 15, min: 2500, next: 5000 };
    if (points >= 1000)
      return { name: "Discipline Pro", level: 10, min: 1000, next: 2500 };
    return { name: "Discipline Starter", level: 1, min: 0, next: 1000 };
  };

  const rank = getRankInfo(wallet?.total_earned || 0);
  const progress = Math.min(
    100,
    Math.max(
      0,
      (((wallet?.total_earned || 0) - rank.min) / (rank.next - rank.min)) * 100,
    ),
  );

  const balance = wallet?.current_balance || 0;


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-500">
      <PageHeader title="Integrity Wallet" subtitle="Loyalty & Performance" />

      <main className="px-5 space-y-8 mt-4">
        {/* HERO SECTION: THE WALLET CARD */}
        <MobileHero wallet={wallet} isLoading={isLoading} rank={rank} progress={progress} balance={balance} setShowBenefits={setShowBenefits} />

        {/* BENTO GRID: SERVICES */}
        <MobileBentoGrid wallet={wallet} />

        {/* GAMIFICATION BANNER: URGENCY */}
        <UrgencyBanner wallet={wallet} />
      </main>

      <BenefitModal isOpen={showBenefits} onClose={() => setShowBenefits(false)} />
    </div>
  );
}
