import { useState } from "react";
import { List, Radar, BarChart3, Star, Banknote } from "lucide-react";
import EmployeeSpiderChart from "./EmployeeSpiderChart";
import EmployeeBarChart from "./EmployeeBarChart";

export default function EmployeeAssessmentView({ row }: { row: any }) {
  const [activeTab, setActiveTab] = useState<'list' | 'radar' | 'bar' | 'bonus'>('list');

  if (!row.is_assessed) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl">
        <p className="text-xs text-gray-400 italic">No data available</p>
      </div>
    );
  }

  const details = row.assessment_data.assessment_details;

  console.log(details)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mx-auto">
        <button 
          onClick={() => setActiveTab('list')}
          className={`p-1.5 rounded-lg transition-all ${activeTab === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-500' : 'text-gray-400'}`}
        >
          <List size={16} />
        </button>
        <button 
          onClick={() => setActiveTab('radar')}
          className={`p-1.5 rounded-lg transition-all ${activeTab === 'radar' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-500' : 'text-gray-400'}`}
        >
          <Radar size={16} />
        </button>
        <button 
          onClick={() => setActiveTab('bar')}
          className={`p-1.5 rounded-lg transition-all ${activeTab === 'bar' ? 'bg-white dark:bg-gray-700 shadow-sm text-brand-500' : 'text-gray-400'}`}
        >
          <BarChart3 size={16} />
        </button>
        <button 
          onClick={() => setActiveTab('bonus')}
          className={`p-1.5 rounded-lg transition-all ${activeTab === 'bonus' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-400'}`}
        >
          <Banknote size={16} />
        </button>
      </div>

      <div className="h-56 flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl overflow-hidden">
        {activeTab === 'list' && (
          <div className="w-full px-4 py-3 flex flex-wrap gap-2 justify-center content-center overflow-y-auto custom-scrollbar h-full">
            {details.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight truncate max-w-20">
                  {d.category_name}
                </span>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-brand-50 dark:bg-brand-500/10 rounded-md">
                    <Star size={10} className="text-brand-500 fill-brand-500" />
                    <span className="text-[10px] font-black text-brand-600 dark:text-brand-400">{d.score}</span>
                  </div>
                  {d.bonus_salary > 0 && (
                    <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      +Rp{Number(d.bonus_salary).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'radar' && <EmployeeSpiderChart details={details} />}
        {activeTab === 'bar' && <EmployeeBarChart details={details} />}
        {activeTab === 'bonus' && (
          <div className="w-full px-4 py-3 space-y-2 overflow-y-auto h-full custom-scrollbar">
            {details.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{d.category_name}</span>
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Level {d.score}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-gray-400 uppercase">Bonus</p>
                  <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">Rp {Number(d.bonus_salary).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}