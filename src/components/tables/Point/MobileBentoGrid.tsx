import { useNavigate } from "react-router-dom";
import { Trophy, History, Package, ArrowUpRight, LucideIcon } from "lucide-react";

export default function MobileBentoGrid() {
  const navigate = useNavigate();

  const menuItems: {
    title: string;
    subtitle: string;
    path: string;
    icon: LucideIcon;
    color: string;
    isLarge?: boolean;
  }[] = [
    {
      title: "Leaderboard",
      subtitle: "Global Standings",
      path: "/point-leaderboard",
      icon: Trophy,
      color: "bg-amber-500",
      isLarge: true,
    },
    {
      title: "Mutations",
      subtitle: "History Log",
      path: "/point-mutations",
      icon: History,
      color: "bg-blue-500",
    },
    {
      title: "Inventory",
      subtitle: "My Collection",
      path: "/my-inventory",
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Wallet Dashboard
        </h3>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-4"></span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${
              item.isLarge ? "col-span-2 flex-row items-center justify-between" : "flex-col space-y-4"
            } bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex group active:scale-[0.98] transition-all overflow-hidden relative shadow-sm`}
          >
            {item.isLarge && (
              <div className="absolute right-0 top-0 mt-2 mr-2 opacity-5 dark:opacity-10 dark:text-amber-500">
                <item.icon size={100} />
              </div>
            )}
            <div className={`flex items-center ${item.isLarge ? "gap-5" : "gap-0"}`}>
              <div className={`${item.isLarge ? "w-14 h-14 rounded-[1.2rem]" : "w-12 h-12 rounded-2xl"} ${item.color} flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                <item.icon size={item.isLarge ? 28 : 24} />
              </div>
              {item.isLarge && (
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.subtitle}</p>
                </div>
              )}
            </div>
            {!item.isLarge && (
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{item.subtitle}</p>
              </div>
            )}
            {item.isLarge && (
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
                <ArrowUpRight size={20} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}