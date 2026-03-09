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
  ChevronRight,
  LogOut,
} from "lucide-react";
import { BiometricCard } from "./BiometricCard";
import { formatDateID } from "@/utils/date";
import { useState } from "react";
import { EditProfileModal } from "@/pages/Employee/EditProfileModal";
import { LeaveBalanceCard } from "./LeaveBalanceCard";
import { useAuth } from "@/hooks/useAuth"; 
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";

export default function ProfileContent({
  user,
  onChangePhoto,
  isMobile,
}: {
  user: any;
  onChangePhoto: () => void;
  isMobile: boolean;
}) {
  const navigate = useNavigate();
  const employee = user?.employee;
  const [activeModal, setActiveModal] = useState<
    "personal" | "employment" | "biometric" | "password" | null
  >(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

   const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("Logged out successfully.");
      queryClient.clear();
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
      setIsLogoutModalOpen(false);
    }
  };

  const renderDesktopLayout = () => (
    <div className="space-y-6">
      <ProfileHeader user={user} onBack={() => navigate(-1)} onChangePhoto={onChangePhoto} />
      
      {/* Desktop Grid */}
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
      </div>
    </div>
  );

  const renderMobileLayout = () => {
    if (activeTab) {
      return (
        <div className="space-y-4 animate-in slide-in-from-right duration-300 pb-10">
          <button 
            onClick={() => setActiveTab(null)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-brand-500 font-bold text-sm mb-4 shadow-sm active:scale-95 transition-all border border-gray-200 dark:border-gray-800"
          >
            <div className="p-1 rounded-full bg-brand-500 text-white">
              <ChevronRight className="rotate-180" size={14} strokeWidth={3} />
            </div>
            Back to Profile Menu
          </button>
          
          {activeTab === "employment" && (
            <SectionCard title="Employment Information" icon={Briefcase}>
              <div className="space-y-4">
                <InfoItem icon={Hash} label="NIK" value={employee?.nik} />
                <InfoItem icon={UserCog} label="Position" value={employee?.position?.name} />
                <InfoItem icon={Building2} label="Team" value={employee?.team?.name} />
                <InfoItem icon={MapPin} label="Division" value={employee?.team?.division} />
                <InfoItem icon={User} label="Manager" value={employee?.manager?.name} />
                <InfoItem icon={Clock} label="Join Date" value={formatDateID(employee?.join_date)} />
              </div>
            </SectionCard>
          )}

          {activeTab === "personal" && (
            <SectionCard title="Personal Details" icon={User}>
              <div className="space-y-4">
                <InfoItem icon={Mail} label="Email" value={user?.email} />
                <div onClick={() => setActiveModal("password")}>
                  <InfoItem icon={Lock} label="Password" value="********" />
                </div>
                <InfoItem icon={Phone} label="Phone" value={employee?.phone} />
                <InfoItem icon={MapPin} label="Address" value={employee?.address} />
              </div>
            </SectionCard>
          )}

          {activeTab === "biometric" && (
            <div className="space-y-6">
              <BiometricCard hasDescriptor={employee?.has_face_descriptor} onAction={() => setActiveModal("biometric")} />
              <CompensationCard employee={employee} />
              <LeaveBalanceCard balances={employee?.leave_balances} />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <ProfileHeader user={user} onBack={() => navigate(-1)} onChangePhoto={onChangePhoto} />
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3 overflow-hidden">
          {[
            { id: "employment", label: "Employment Information", icon: Briefcase },
            { id: "personal", label: "Personal Details", icon: User },
            { id: "biometric", label: "Biometric & Salary", icon: UserCog },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-gray-700 dark:text-white/90">{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Prominent Logout Section */}
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          disabled={loading}
          className="w-full mt-8 p-6 border-2 border-dashed border-red-200 bg-red-50 dark:bg-red-500/5 dark:border-red-500/20 rounded-2xl flex flex-col items-center justify-center gap-3 group transition-all active:scale-[0.98]"
        >
          <div className="p-3 rounded-full bg-white dark:bg-gray-900 text-red-500 shadow-sm group-hover:scale-110 transition-transform">
            <LogOut size={28} />
          </div>
          <div className="text-center">
            <span className="block font-bold text-red-600 dark:text-red-400">
              {loading ? "Logging out..." : "Logout from Session"}
            </span>
            <span className="text-xs text-red-400 dark:text-red-500/60">
              Your active session will be ended securely
            </span>
          </div>
        </button>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500">
      {isMobile ? renderMobileLayout() : renderDesktopLayout()}

      <EditProfileModal
        isOpen={!!activeModal}
        onClose={() => {
          setActiveModal(null);
          // If we were in a sub-page, stay there, otherwise reset
        }}
        type={activeModal}
        data={user}
        onSubmit={(formData) => {
          console.log("Form submitted:", formData);
          setActiveModal(null);
        }}
      />

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        confirmLabel="Logout"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
