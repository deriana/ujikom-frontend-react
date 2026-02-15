import EmploymentHierarchySection from "@/components/form/users/EmploymentHierarchySection";
import PersonalAccountSection from "@/components/form/users/PersonalAccountSection";
import StatusCompensationSection from "@/components/form/users/StatusCompensationSection";
import { Division, Manager, Position, UserInput } from "@/types";

export default function UserField({
  value,
  onChange,
  roles,
  positions,
  divisions,
  managers,
  disabled = false,
}: {
  value: UserInput;
  onChange: (val: UserInput) => void;
  roles: { id: number; name: string, system_reserve: boolean}[];
  positions: Position[];
  divisions: Division[];
  managers: Manager[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-10">
      <PersonalAccountSection
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <EmploymentHierarchySection
        value={value}
        onChange={onChange}
        roles={roles}
        positions={positions}
        divisions={divisions}
        managers={managers}
        disabled={disabled}
      />
      <StatusCompensationSection
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
