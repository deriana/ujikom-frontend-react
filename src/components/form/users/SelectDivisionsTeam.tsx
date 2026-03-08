import Select from "@/components/form/Select";
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
  // Transform hierarchical data (Divisions -> Teams) into a flat list for the Select component.
  // We format the label as "Team Name (Division Name)" to keep the context visible since
  // the custom Select component doesn't support <optgroup> headers natively.
  const options = divisions.flatMap((division) =>
    division.teams.map((team) => ({
      value: team.uuid,
      label: `${team.name} (${division.name})`,
    }))
  );

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Select Team"
    />
  );
}