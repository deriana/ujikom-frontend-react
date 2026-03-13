import ReactApexChart from "react-apexcharts";
import MonthPicker from "@/components/form/MonthPicker";
import { TrendingUp, TrendingDown, BarChart3, Users } from "lucide-react";

interface HeaderAnalytycSectionProps {
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
  categoryStats: { name: string; average: number }[];
  bestCategory?: { name: string; average: number };
  worstCategory?: { name: string; average: number };
  totalEmployees?: number;
  assessedCount?: number;
  isMobile: boolean;
}

export default function HeaderAnalytycSection({
  periodFilter,
  setPeriodFilter,
  categoryStats,
  bestCategory,
  worstCategory,
  totalEmployees = 0,
  assessedCount = 0,
  isMobile = false,
}: HeaderAnalytycSectionProps) {
  const hasData = categoryStats.length > 0;
  const pendingCount = totalEmployees - assessedCount;

  const donutOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut' },
    labels: ['Assessed', 'Pending'],
    colors: ['#10b981', '#f59e0b'],
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: '75%', labels: { show: false } }
      }
    },
    stroke: { show: false }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{isMobile ? "Select Period" : "Performance Overview"}</h3>
              {!isMobile && <p className="text-sm text-gray-500">Average scores by category for {periodFilter}</p>}
            </div>
            <div className={isMobile ? "w-full" : "min-w-50"}>
              <MonthPicker id="filter-period" value={periodFilter} onChange={setPeriodFilter} />
            </div>
          </div>
          
          {!isMobile && <div className="h-70 w-full">
            {hasData ? (
              <ReactApexChart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: { show: false },
                    fontFamily: 'inherit'
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 6,
                      horizontal: !isMobile,
                      barHeight: '40%',
                      distributed: true,
                    }
                  },
                  colors: categoryStats.map(s => s.average >= 4 ? '#10b981' : s.average >= 3 ? '#6366f1' : '#f59e0b'),
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => val,
                    style: { fontSize: '12px', fontWeight: 'bold' }
                  },
                  xaxis: {
                    categories: categoryStats.map(s => s.name),
                    max: isMobile ? undefined : 5,
                    labels: { show: isMobile, style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 600 } },
                    axisBorder: { show: false },
                    axisTicks: { show: false }
                  },
                  yaxis: {
                    labels: { show: !isMobile,
                      style: { fontWeight: 600, colors: '#64748b' }
                    }
                  },
                  grid: {
                    show: false,
                  },
                  legend: { show: false },
                  tooltip: { theme: 'dark' }
                }}
                series={[{ name: 'Average Score', data: categoryStats.map(s => s.average) }]}
                type="bar"
                height="100%"
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-3">
                  <BarChart3 className="text-gray-300 dark:text-gray-600" size={32} />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No Data Available</p>
                <p className="text-xs text-gray-400 mt-1">Try selecting a different period</p>
              </div>
            )}
          </div>}
        </div>

        {!isMobile && <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-20 h-20 shrink-0">
              <ReactApexChart options={donutOptions} series={[assessedCount, pendingCount]} type="donut" height="100%" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users size={14} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completion</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-gray-900 dark:text-white">{assessedCount}</span>
                <span className="text-xs text-gray-400 font-bold">/ {totalEmployees}</span>
              </div>
              <p className="text-[10px] text-emerald-500 font-bold mt-0.5">{Math.round((assessedCount / (totalEmployees || 1)) * 100)}% Reviewed</p>
            </div>
          </div>

          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500 rounded-xl text-white"><TrendingUp size={20} /></div>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Top Strength</span>
            </div>
            <h4 className="text-xl font-black text-emerald-900 dark:text-emerald-100">{bestCategory?.name || "N/A"}</h4>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/60 mt-1">Highest average score: {bestCategory?.average || 0}/5</p>
          </div>

          <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-800/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500 rounded-xl text-white"><TrendingDown size={20} /></div>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Needs Improvement</span>
            </div>
            <h4 className="text-xl font-black text-amber-900 dark:text-amber-100">{worstCategory?.name || "N/A"}</h4>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/60 mt-1">Lowest average score: {worstCategory?.average || 0}/5</p>
          </div>
        </div>}
      </div>
  );
}
