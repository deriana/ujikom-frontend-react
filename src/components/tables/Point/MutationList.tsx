import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { formatDateID } from "@/utils/date";
import EmptyState from "@/components/tables/Point/EmptyState";
import { PointMutation } from "@/types";

interface MutationListProps {
  isLoading: boolean;
  filteredMutations: PointMutation[];
}

export default function MutationList({ isLoading, filteredMutations }: MutationListProps) {
  return (
    <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-3xl" />
            ))
          ) : filteredMutations.length > 0 ? (
            filteredMutations.map((mutation) => (
              <div 
                key={mutation.uuid}
                className="group bg-white dark:bg-[#0B0F1A] border border-gray-100 dark:border-white/5 p-6 rounded-4xl flex items-center justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    mutation.amount >= 0 
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600' 
                      : 'bg-red-50 dark:bg-red-500/10 text-red-600'
                  }`}>
                    {mutation.amount >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {mutation.type}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                        <Clock size={12} />
                        {mutation.date_human} • {formatDateID(mutation.date)}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {mutation.description}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-black ${mutation.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {mutation.amount >= 0 ? '+' : ''}{mutation.amount.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Points</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
  );
}