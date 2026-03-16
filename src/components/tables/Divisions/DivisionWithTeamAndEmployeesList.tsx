import { useDivisionWithTeamAndEmployees } from "@/hooks/useDivision";
import UserProfile from "@/components/UserProfile";
import { 
  Search, 
  Users, 
  Briefcase, 
  IdCard, 
  LayoutGrid, 
  AlertCircle, 
  User,
  Filter
} from "lucide-react";
import { useState, useMemo } from "react";

// --- SKELETON COMPONENT (Matched with your reference) ---
const DivisionSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-3 w-20 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="h-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function DivisionDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: divisions = [], isLoading } = useDivisionWithTeamAndEmployees();

  // Search Logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return divisions;
    
    return divisions.map(division => ({
      ...division,
      teams: division.teams.map(team => ({
        ...team,
        members: (team.members || []).filter(emp => 
          emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(team => team.members.length > 0)
    })).filter(division => division.teams.length > 0);
  }, [searchTerm, divisions]);

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/20 transition-colors duration-300 rounded-3xl p-4 md:p-8 border border-gray-100 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Search (Matched with Leave Monitoring style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Division Directory</h2>
            <p className="text-sm text-gray-500">Manage and monitor organizational structure</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-20 dark:text-white dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <Filter className="w-5 h-5 text-indigo-600" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <DivisionSkeleton />
        ) : (
          <div className="space-y-12">
            {filteredData.map((division) => (
              <section key={division.uuid} className="space-y-6">
                
                {/* Division Header (Indigo Accent) */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                        {division.division_name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50">
                          {division.division_code}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {division.teams.length} Teams
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty Division State */}
                {division.teams.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-900/40 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Users className="w-10 h-10 text-gray-300 mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No teams assigned to this division yet</p>
                  </div>
                )}

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {division.teams.map((team) => (
                    <div
                      key={team.uuid}
                      className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/40 transition-all duration-300"
                    >
                      {/* Team Header */}
                      <div className="px-5 py-4 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-800/20">
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 truncate">{team.team_name}</h4>
                        <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700">
                          {team.total_members} Members
                        </span>
                      </div>

                      {/* Employee List */}
                      <div className="p-4 space-y-4">
                        {(!team.members || team.members.length === 0) ? (
                          <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                            <User className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                              No Members Found
                            </p>
                          </div>
                        ) : team.members.map((emp) => (
                          <div
                            key={emp.nik}
                            className="flex items-start gap-4 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/20 transition-all"
                          >
                            {/* Avatar (Matched with UserProfile size) */}
                            <div className="relative shrink-0">
                              <UserProfile
                                src={emp.avatar}
                                alt={emp.name}
                                size={44}
                                className="ring-2 ring-white dark:ring-gray-800"
                              />
                              {emp.employment.is_contract_ended && (
                                <div className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white dark:border-gray-900"></span>
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-indigo-600 transition-colors">
                                  {emp.name}
                                </p>
                                <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase border ${
                                  emp.status.label === "Permanent"
                                    ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800/40"
                                    : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800/40"
                                }`}>
                                  {emp.status.label}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                  <Briefcase className="w-3 h-3 text-indigo-400" />
                                  <span className="truncate">{emp.position}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                                  <IdCard className="w-3 h-3 text-indigo-400" />
                                  {emp.nik}
                                </div>
                              </div>

                              {emp.employment.is_contract_ended && (
                                <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-100 dark:border-red-900/20">
                                  <AlertCircle size={12} className="shrink-0" />
                                  CONTRACT EXPIRED
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Empty State (Matched with reference) */}
        {!isLoading && filteredData.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
            <User className="mx-auto w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">No results</h3>
            <p className="text-sm text-gray-500">Try adjusting your search for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm("")}
              className="mt-4 text-indigo-600 font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
