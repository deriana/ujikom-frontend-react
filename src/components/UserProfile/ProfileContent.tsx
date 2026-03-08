import { useNavigate } from "react-router-dom";
import { CompensationCard, ProfileHeader } from "./ProfileSection";
import { InfoItem, SectionCard } from "./ProfileComponent";
import {
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  User,
  Building2,
  UserCog,
  Clock,
  Hash,
  Mail,
  Lock,
  Pencil,
} from "lucide-react";
import { BiometricCard } from "./BiometricCard";
import { formatDateID } from "@/utils/date";
import { useState } from "react";
import { EditProfileModal } from "@/pages/Employee/EditProfileModal";
import { LeaveBalanceCard } from "./LeaveBalanceCard";

export default function ProfileContent({
  user,
  onChangePhoto,
}: {
  user: any;
  onChangePhoto: () => void;
}) {
  const navigate = useNavigate();
  const employee = user?.employee;
  const [activeModal, setActiveModal] = useState<
    "personal" | "employment" | "biometric" | "password" | null
  >(null);


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <ProfileHeader
        user={user}
        onBack={() => navigate(-1)}
        onChangePhoto={onChangePhoto}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Informasi Inti (Pekerjaan) */}
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="Employment Information" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem icon={Hash} label="NIK" value={employee?.nik} />
              <InfoItem
                icon={UserCog}
                label="Position"
                value={employee?.position?.name}
              />
              <InfoItem
                icon={Building2}
                label="Team"
                value={employee?.team?.name}
              />
              <InfoItem
                icon={MapPin}
                label="Division"
                value={employee?.team?.division}
              />
              <InfoItem
                icon={User}
                label="Manager"
                value={employee?.manager?.name}
              />
              <InfoItem
                icon={Clock}
                label="Join Date"
                value={formatDateID(employee?.join_date)}
              />
              <InfoItem
                icon={Calendar}
                label="Contract Period"
                value={`${formatDateID(employee?.contract_start)} - ${formatDateID(employee?.contract_end)}`}
              />
            </div>
          </SectionCard>

          <SectionCard title="Personal Details" icon={User}>
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <InfoItem icon={Mail} label="Email Address" value={user?.email} />
              <div
                className="relative group/pass cursor-pointer"
                onClick={() => setActiveModal("password")}
              >
                <InfoItem
                  icon={Lock}
                  label="Password"
                  value="********"
                  className="group-hover/pass:border-brand-500/50 group-hover/pass:bg-brand-500/2 transition-all"
                />
                <div className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-400 group-hover/pass:text-brand-500 group-hover/pass:bg-brand-500/10 transition-all opacity-0 group-hover/pass:opacity-100">
                  <Pencil size={12} />
                </div>
              </div>
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={employee?.phone}
              />
              <InfoItem
                icon={User}
                label="Gender"
                value={
                  employee?.gender
                    ? employee.gender === "male"
                      ? "Laki-laki"
                      : "Perempuan"
                    : "-"
                }
              />
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={formatDateID(employee?.date_of_birth)}
              />
              <InfoItem
                icon={MapPin}
                label="Address"
                value={employee?.address}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <BiometricCard
            hasDescriptor={employee?.has_face_descriptor}
            onAction={() => setActiveModal("biometric")}
          />
          <CompensationCard employee={employee} />
          <LeaveBalanceCard balances={employee?.leave_balances} />
        </div>

        <EditProfileModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal}
          data={user}
          onSubmit={(formData) => console.log("Form submitted:", formData)}
        />
      </div>
    </div>
  );
}
