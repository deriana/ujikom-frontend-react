import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useTicketDashboard } from "@/hooks/useTicket";
import { TicketCheck, Clock, AlertCircle, CheckCircle2, Star, TrendingUp } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import Badge from "@/components/ui/badge/Badge";
import { formatDateID } from "@/utils/date";
import { Link } from "react-router-dom";

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </div>
  </div>
);

export default function TicketsDashboard() {
  const { data, isLoading } = useTicketDashboard();

  if (isLoading) return (
    <div className="p-6">
      <PageBreadcrumb pageTitle="Tickets Dashboard" />
      <DashboardSkeleton />
    </div>
  );

  const summary = data?.summary || { total: 0, open: 0, in_progress: 0, closed: 0, average_rating: 0 };
  const recentTickets = data?.recent_tickets || [];

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
    },
    labels: ['Open', 'In Progress', 'Closed'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    legend: {
      position: 'bottom',
      labels: { colors: 'currentColor' }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => summary.total.toString(),
              color: 'currentColor'
            }
          }
        }
      }
    },
    theme: { mode: document.documentElement.classList.contains('dark') ? 'dark' : 'light' },
    dataLabels: { enabled: false }
  };

  const stats = [
    { label: "Total Tickets", value: summary.total, icon: TicketCheck, color: "blue" },
    { label: "Open", value: summary.open, icon: AlertCircle, color: "emerald" },
    { label: "In Progress", value: summary.in_progress, icon: Clock, color: "amber" },
    { label: "Closed", value: summary.closed, icon: CheckCircle2, color: "purple" },
  ];

  return (
    <>
      <PageMeta title="Tickets Dashboard" />
      <PageBreadcrumb pageTitle="Tickets Dashboard" />
      
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className={`p-5 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/10 border border-${stat.color}-100 dark:border-${stat.color}-800/50`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 bg-${stat.color}-500 rounded-xl text-white shadow-lg shadow-${stat.color}-500/20`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className={`text-xs font-bold text-${stat.color}-600 dark:text-${stat.color}-400 uppercase tracking-wider`}>
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tickets */}
          <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                Recent Tickets
              </h3>
              <Link to="/tickets" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4 font-bold">Subject</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {recentTickets.map((ticket: any) => (
                    <tr key={ticket.uuid} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/tickets/${ticket.uuid}/show`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 block truncate max-w-[200px]">
                          {ticket.subject}
                        </Link>
                        <span className="text-[10px] text-gray-400">by {ticket.reporter?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          size="sm" 
                          color={ticket.status === 'open' ? 'success' : ticket.status === 'closed' ? 'error' : 'warning'}
                        >
                          {ticket.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {formatDateID(ticket.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Chart & Rating */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Status Distribution</h3>
              <div className="dark:text-white">
                <ReactApexChart 
                  options={chartOptions} 
                  series={[summary.open, summary.in_progress, summary.closed]} 
                  type="donut" 
                  height={280} 
                />
              </div>
            </div>

            <div className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/20 dark:bg-blue-900/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest">Avg. Satisfaction</h4>
                <Star size={18} className="text-amber-500 fill-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-gray-900 dark:text-white">{summary.average_rating}</span>
                <span className="text-gray-400 text-sm">/ 5.0</span>
              </div>
              <div className="mt-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={14} 
                    className={s <= Math.round(summary.average_rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
