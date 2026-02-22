import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Checkbox from "@/components/form/input/Checkbox";
import DatePicker from "@/components/form/date-picker";
import { UserInput } from "@/types";
import { User, Phone, Cake, MapPin, KeyRound } from "lucide-react";
import { useState } from "react";

interface Props {
  value: UserInput;
  onChange: (val: UserInput) => void;
  disabled?: boolean;
}

export default function PersonalAccountSection({
  value,
  onChange,
  disabled = false,
}: Props) {
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <User size={20} className="text-brand-500" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Personal & Account
          </h3>
        </div>
        <div className="flex gap-5">
          <Checkbox
            label="Account Active"
            checked={!!value.is_active}
            onChange={() => onChange({ ...value, is_active: !value.is_active })}
            disabled={disabled}
          />
          <Checkbox
            label="Resigned"
            checked={!!value.isResigned}
            onChange={(checked) => {
              if (!checked) {
                onChange({ ...value, resign_date: null, isResigned: false });
              } else {
                onChange({ ...value, isResigned: true });
              }
            }}
            disabled={disabled}
          />
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="space-y-1.5 lg:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            Full Name
          </label>
          <Input
            value={value.name}
            disabled={disabled}
            placeholder="e.g. John Doe"
            onChange={(e) => onChange({ ...value, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Gender
          </label>
          <Select
            options={genderOptions}
            value={value.gender || ""}
            onChange={(val) =>
              onChange({ ...value, gender: val as "male" | "female" })
            }
            disabled={disabled}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Phone size={12} /> Phone Number
          </label>
          <Input
            value={value.phone || ""}
            disabled={disabled}
            placeholder="0812..."
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Cake size={12} /> Date of Birth
          </label>
          <DatePicker
            id="dob_picker"
            placeholder="Select birthday"
            value={value.date_of_birth || ""}
            onChange={(_selectedDates, dateStr) => {
              onChange({ ...value, date_of_birth: dateStr });
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            Email Address
          </label>
          <Input
            type="email"
            value={value.email}
            disabled={disabled}
            placeholder="john@company.com"
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </div>
        <div className="lg:col-span-3 pt-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
            <Checkbox
              id="change_password_trigger"
              label="Change Account Password?"
              checked={showPasswordFields}
              onChange={(checked) => {
                setShowPasswordFields(checked);
                // Reset password jika checkbox dimatikan
                if (!checked) {
                  onChange({ ...value, password: "", password_confirmation: "" });
                }
              }}
              disabled={disabled}
            />
            <span className="text-[10px] text-gray-400 italic">
              *Leave unchecked if you don't want to change the password
            </span>
          </div>
        </div>

        {showPasswordFields && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <KeyRound size={12} /> New Password
              </label>
              <Input
                type="password"
                value={value.password || ""}
                disabled={disabled}
                placeholder="••••••••"
                onChange={(e) => onChange({ ...value, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={value.password_confirmation || ""}
                disabled={disabled}
                placeholder="••••••••"
                onChange={(e) =>
                  onChange({ ...value, password_confirmation: e.target.value })
                }
              />
            </div>
          </>
        )}
        <div className="space-y-1.5 lg:col-span-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <MapPin size={12} /> Full Address
          </label>
          <Input
            value={value.address || ""}
            disabled={disabled}
            placeholder="e.g. Street Name, City, Province"
            onChange={(e) => onChange({ ...value, address: e.target.value })}
          />
        </div>
      </div>
    </section>
  );
}
