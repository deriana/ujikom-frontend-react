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
  GraduationCap,
} from "lucide-react";

export default function UsersShowContent({ user, onChangePhoto }: { user: any, onChangePhoto: () => void}) {
  const navigate = useNavigate();
  const employee = user?.employee;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Back Button */}
      <ProfileHeader
        user={user}
        onBack={() => navigate(-1)}
        onChangePhoto={onChangePhoto}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Section */}
          <SectionCard title="Personal Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={employee?.phone}
              />
              <InfoItem
                icon={UserCog}
                label="Gender"
                value={
                  employee?.gender
                    ? employee.gender.charAt(0).toUpperCase() +
                      employee.gender.slice(1)
                    : "-"
                }
              />
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={employee?.date_of_birth}
              />
              <InfoItem
                icon={MapPin}
                label="Address"
                value={employee?.address}
              />
            </div>
          </SectionCard>

          {/* Employment Section */}
          <SectionCard title="Employment Details" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={Hash} label="NIK" value={employee?.nik} />
              <InfoItem
                icon={GraduationCap}
                label="Position"
                value={employee?.position?.name}
              />
              <InfoItem
                icon={Building2}
                label="Team / Division"
                value={`${employee?.team?.name} - ${employee?.team?.division}`}
              />
              <InfoItem
                icon={Clock}
                label="Join Date"
                value={employee?.join_date}
              />
              <InfoItem
                icon={User}
                label="Reporting Manager"
                value={employee?.manager?.name}
              />
            </div>
          </SectionCard>
        </div>

        {/* Compensation Section */}
        <div className="lg:col-span-1">
          <CompensationCard employee={employee} />
        </div>
      </div>
    </div>
  );
}
