import { EmployeeLeavaBalances } from "@/types";
import { User, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useGetEmployeeLeaveBalances } from "@/hooks/useUser";
import { useState } from "react";
import Input from "@/components/form/input/InputField";
import UserProfile from "@/components/UserProfile";

// --- SKELETON COMPONENT ---
const LeaveBalanceSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex-1">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl" />
          <div className="h-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

export default function EmployeeLeaveBalancesCard() {
  const { data: leaveBalances = [], isLoading, isError, error } = useGetEmployeeLeaveBalances();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Search Logic
  const filteredData = Array.isArray(leaveBalances) ? leaveBalances.filter((item: EmployeeLeavaBalances) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.position.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-red-50 rounded-2xl border border-red-100 dark:bg-red-950/10">
        <AlertCircle className="text-red-500 mb-2" size={32} />
        <h3 className="text-red-800 font-bold">Failed to load data</h3>
        <p className="text-red-600 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Leave Monitoring</h2>
          <p className="text-sm text-gray-500">Track and manage employee leave availability</p>
        </div>
        <div className="w-full md:w-72">
          <Input
            type="text"
            placeholder="Search by name, NIK, or position..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <LeaveBalanceSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedData.map((employee: EmployeeLeavaBalances) => {
              // Status "Critical" hanya berlaku jika sisa cuti <= 1 DAN bukan tipe unlimited
              const anyCritical = employee.leave_balances?.some(
                b => !b.is_unlimited && b.remaining_days <= 1 && b.total_days > 0
              );

              return (
                <div 
                  key={employee.nik} 
                  className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/40 transition-all duration-300"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserProfile
                          src={employee.profile_photo}
                          alt={employee.name}
                          size={48}
                          className="ring-2 ring-gray-50 dark:ring-gray-800"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-900"></div>
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                          {employee.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {employee.nik} • {employee.position}
                        </p>
                      </div>
                    </div>
                    
                    {anyCritical ? (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:border-red-800/40 text-[10px] font-bold">
                         <AlertCircle size={14} />
                         Alert
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:border-green-800/40 text-[10px] font-bold">
                         <CheckCircle2 size={14} />
                         Safe
                      </div>
                    )}
                  </div>

                  {/* Leave Distribution List */}
                  <div className="space-y-3">
                    {employee.leave_balances?.map((balance, idx) => {
                      const isUnlimited = balance.is_unlimited;
                      const usagePercent = isUnlimited ? 0 : (balance.used_days / (balance.total_days || 1)) * 100;
                      const isLow = !isUnlimited && balance.remaining_days <= 2 && balance.total_days > 0;

                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded-xl border transition-colors ${
                            isLow 
                            ? "bg-red-50/30 border-red-100 dark:bg-red-950/10 dark:border-red-900/20" 
                            : "bg-gray-50/50 border-gray-100 dark:bg-gray-800/30 dark:border-gray-700/50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                              {balance.leave_type}
                            </span>
                            <div className="flex flex-col items-end">
                              <span className={`text-sm font-black ${isLow ? 'text-red-600' : 'text-gray-800 dark:text-gray-200'}`}>
                                {isUnlimited ? "∞" : balance.remaining_days}
                              </span>
                              {!isUnlimited && (
                                <span className="text-[9px] font-medium opacity-60 dark:text-white">DAYS LEFT</span>
                              )}
                            </div>
                          </div>

                          {/* Progress Bar (Hanya jika tidak unlimited) */}
                          {!isUnlimited ? (
                            <div className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  usagePercent > 85 ? 'bg-orange-500' : isLow ? 'bg-red-500' : 'bg-blue-600'
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-[10px] text-indigo-500 font-medium">
                              <Info size={12} />
                              Unlimited allowance
                            </div>
                          )}

                          <div className="flex justify-between mt-2 text-[9px] font-semibold text-gray-400 uppercase">
                            <span>Used: <span className="text-gray-700 dark:text-gray-300">{balance.used_days}</span></span>
                            {!isUnlimited && (
                              <span>Total: <span className="text-gray-700 dark:text-gray-300">{balance.total_days}</span></span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span> employees
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <User size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No data found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any employees matching "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-4 text-blue-600 font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}