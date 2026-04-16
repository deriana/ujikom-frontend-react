import { Modal } from "@/components/ui/modal";
import { Gift, Trophy, Zap, Star } from "lucide-react";

interface BenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BenefitModal({ isOpen, onClose }: BenefitModalProps) {
  const benefits = [
    {
      title: "Exclusive Rewards",
      desc: "Redeem points for shopping vouchers, gadgets, and more.",
      icon: <Gift className="text-pink-500" />,
    },
    {
      title: "Career Growth",
      desc: "High points reflect your discipline and performance records.",
      icon: <Trophy className="text-amber-500" />,
    },
    {
      title: "Power Ups",
      desc: "Get special items to boost your attendance flexibility.",
      icon: <Zap className="text-indigo-500" />,
    },
    {
      title: "Recognition",
      desc: "Top performers get featured on the company leaderboard.",
      icon: <Star className="text-blue-500" />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm m-4">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Gift size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                Wallet Benefits
              </h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                Maximize your points
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Got It
          </button>
        </div>
      </Modal>
  );
}