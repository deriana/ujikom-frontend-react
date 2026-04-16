import { useState, useEffect } from "react";
import { Trophy, Calendar, Clock } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeaderLeaderboardProps {
  period?: string;
}

export default function HeaderLeaderboard({ period }: HeaderLeaderboardProps) {
  const isMobile = useIsMobile();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: Hari pertama bulan depan, jam 00:00:00
      const target = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) return "SEASON ENDED";

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      // Format: DDd : HHh : MMm (tambah detik jika ingin lebih 'live')
      return `${String(days).padStart(2, '0')}D : ${String(hours).padStart(2, '0')}H : ${String(minutes).padStart(2, '0')}M : ${String(seconds).padStart(2, '0')}S`;
    };

    // Update setiap detik
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial call
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex w-full mb-8 ${isMobile ? "flex-col gap-6" : "flex-row justify-between items-end"}`}>
      {/* Title & Badge Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 rounded-xl">
            <Trophy className="text-indigo-500 w-7 h-7 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
          </div>
          <h1 className={`font-black tracking-tighter text-gray-900 dark:text-white uppercase ${
            isMobile ? "text-2xl" : "text-4xl"
          }`}>
            Leaderboard
          </h1>
        </div>
        <Badge color="primary">
          <Calendar size={14} className="mr-2 inline opacity-70" />
          {period || "Current Period"}
        </Badge>
      </div>

      {/* Countdown Section - Glassmorphism Aesthetic */}
      <div className={`group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 ring-1 ring-white/5 shadow-2xl ${
        isMobile ? "w-full justify-between" : "min-w-55"
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
             {/* Glow effect behind clock */}
            <div className="absolute inset-0 bg-red-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative p-2.5 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20">
              <Clock size={18} className="animate-spin-slow" />
            </div>
          </div>
          
          <div className="leading-tight">
            <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">
              Ends in
            </p>
            <p className="text-lg font-black text-gray-900 dark:text-white tabular-nums tracking-tighter">
              {timeLeft || "LOADING..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}