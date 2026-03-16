import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { DollarSign, TrendingUp, Wallet, Receipt, ArrowUpRight } from "lucide-react";
import type { Payroll } from "@/types";

interface ChartPayrollProps {
  data: Payroll[];
}

export default function ChartPayroll({ data }: ChartPayrollProps) {
  const processed = useMemo(() => {
    // 1. Financial Stats
    const totalGross = data.reduce((acc, curr) => acc + Number(curr.gross_salary || 0), 0);
    const totalNet = data.reduce((acc, curr) => acc + Number(curr.net_salary || 0), 0);
    const totalAdjustment = data.reduce((acc, curr) => acc + Number(curr.manual_adjustment || 0), 0);
    const avgSalary = data.length > 0 ? totalNet / data.length : 0;

    // 2. Perbandingan Gross vs Net (Grouped Bar Chart)
    // Kita ambil 5-10 sampel karyawan terakhir untuk perbandingan individu
    const sampleData = data.slice(0, 8);
    const categories = sampleData.map(d => d.employee_name.split(' ')[0]);
    const grossSeries = sampleData.map(d => Number(d.gross_salary || 0));
    const netSeries = sampleData.map(d => Number(d.net_salary || 0));

    // 3. Status Pie Chart
    const statusLabels = ["Draft", "Finalized", "Voided"];
    const statusSeries = [
      data.filter(d => d.status === 0).length,
      data.filter(d => d.status === 1).length,
      data.filter(d => d.status === 2).length,
    ];

    return { totalGross, totalNet, totalAdjustment, avgSalary, categories, grossSeries, netSeries, statusSeries, statusLabels };
  }, [data]);

  const barOptions: any = {
    chart: { toolbar: { show: false }, fontFamily: 'Inter' },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 4 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: processed.categories },
    yaxis: { labels: { formatter: (val: number) => `Rp ${val.toLocaleString()}` } },
    colors: ['#6366f1', '#10b981'], // Indigo for Gross, Emerald for Net
    legend: { position: 'top', horizontalAlign: 'right' },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => `Rp ${val.toLocaleString()}` } }
  };

  const donutOptions: any = {
    labels: processed.statusLabels,
    colors: ['#94a3b8', '#10b981', '#ef4444'],
    plotOptions: { pie: { donut: { size: '75%' } } },
    legend: { position: 'bottom' },
    dataLabels: { enabled: false }
  };

  return (
    <div className="space-y-6">
      {/* Financial Info Spans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinanceCard title="Total Gross" value={processed.totalGross} icon={DollarSign} color="text-indigo-600" bg="bg-indigo-50" />
        <FinanceCard title="Total Net Pay" value={processed.totalNet} icon={Wallet} color="text-emerald-600" bg="bg-emerald-50" />
        <FinanceCard title="Avg. Take Home" value={processed.avgSalary} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
        <FinanceCard title="Manual Adj." value={processed.totalAdjustment} icon={Receipt} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-gray-800 dark:text-white">Gross vs Net Comparison</h4>
            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500 font-bold uppercase">Per Employee</span>
          </div>
          <ReactApexChart 
            options={barOptions} 
            series={[
              { name: 'Gross Salary', data: processed.grossSeries },
              { name: 'Net Salary', data: processed.netSeries }
            ]} 
            type="bar" 
            height={320} 
          />
        </div>

        {/* Status Donut */}
        <div className="bg-white dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h4 className="font-bold text-gray-800 dark:text-white mb-6">Payroll Status</h4>
          <ReactApexChart options={donutOptions} series={processed.statusSeries} type="donut" height={320} />
        </div>
      </div>
    </div>
  );
}

function FinanceCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 relative overflow-hidden group transition-all hover:border-indigo-300">
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{title}</p>
          <p className="text-xl font-bold dark:text-white mt-1">
            Rp {Math.round(value).toLocaleString()}
          </p>
        </div>
        <div className={`p-2 rounded-xl ${bg} dark:bg-opacity-10`}>
          <Icon className={color} size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
        <ArrowUpRight size={12} />
        <span>COMPUTED DATA</span>
      </div>
      {/* Decorative Gradient */}
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 ${bg} opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform`} />
    </div>
  );
}