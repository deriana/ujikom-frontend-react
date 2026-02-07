// File: @/components/form/users/SelectDivisionTeam.tsx
import { Division } from "@/types";

interface SelectDivisionTeamProps {
  divisions: Division[];
  value?: string;
  onChange: (teamUuid: string) => void;
  disabled?: boolean;
}

export default function SelectDivisionTeam({
  divisions,
  value = "",
  onChange,
  disabled = false,
}: SelectDivisionTeamProps) {
  return (
    <div className="relative">
      <select
        className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs transition-all 
                   focus:border-brand-300 focus:ring-brand-500/20 focus:outline-none
                   dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-800
                   disabled:bg-gray-100 disabled:cursor-not-allowed opacity-70"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>Select Team</option>
        {divisions.map((division) => (
          <optgroup key={division.uuid} label={division.name} className="bg-gray-50 dark:bg-gray-800 font-bold">
            {division.teams.length > 0 ? (
              division.teams.map((team) => (
                <option key={team.uuid} value={team.uuid} className="bg-white dark:bg-gray-900 font-normal">
                  {team.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No teams available</option>
            )}
          </optgroup>
        ))}
      </select>
    </div>
  );
}