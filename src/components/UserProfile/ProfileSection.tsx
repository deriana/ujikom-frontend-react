import { ArrowLeft, Mail, ShieldCheck, DollarSign } from "lucide-react";
import { SectionCard, StatusBadge } from "./ProfileComponent";
import { Can } from "@/components/auth/Can";
import { buildPermission, PERMISSIONS } from "@/constants/Permissions";
import { RESOURCES } from "@/constants/Resource";

export const ProfileHeader = ({ user, onBack, onChangePhoto }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-white/2 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-5">
      <div className="relative">
        {user?.employee?.profile_photo ? (
          <img
            src={user.employee.profile_photo} // ini harus URL full dari media
            alt={user?.name}
            className="size-20 rounded-2xl object-cover shadow-lg shadow-brand-500/20"
          />
        ) : (
          <div className="size-20 rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-500/20">
            {user?.name?.charAt(0)}
          </div>
        )}

        <div className="absolute -bottom-2 -right-2 size-8 rounded-lg bg-white dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-800 flex items-center justify-center text-brand-500">
          <ShieldCheck size={18} />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {user?.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-sm mt-1">
          <Mail size={14} /> {user?.email}
        </p>
        <div className="flex gap-2 mt-3">
          <StatusBadge status={user?.employee?.status} />
          <StatusBadge status={user?.employee?.employment_state} />
        </div>
      </div>
    </div>

    {/* Tombol action di kanan */}
    <div className="flex gap-2">
      <Can value={buildPermission(RESOURCES.USER, PERMISSIONS.BASE.INDEX)}>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to List
        </button>
      </Can>

      {(user?.can.update ||
        buildPermission(RESOURCES.USER, PERMISSIONS.BASE.EDIT)) && (
        <button
          onClick={onChangePhoto}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium group"
        >
          Change Photo
        </button>
      )}
    </div>
  </div>
);

export const CompensationCard = ({ employee }: any) => (
  <SectionCard title="Compensation" icon={DollarSign}>
    <div className="p-5 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 mb-4">
      <p className="text-xs text-brand-600 dark:text-brand-400 font-bold uppercase">
        Base Salary
      </p>
      <p className="text-2xl font-black text-brand-700 dark:text-brand-300">
        Rp{" "}
        {new Intl.NumberFormat("id-ID").format(
          parseFloat(employee?.base_salary || 0),
        )}
      </p>
    </div>
    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 px-1">
      Monthly Allowances
    </p>
    <div className="space-y-2">
      {employee?.position?.allowances?.map((allowance: any, idx: number) => (
        <div
          key={idx}
          className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/1 border border-gray-100 dark:border-gray-800"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {allowance.name}
          </span>
          <span className="text-sm font-bold text-gray-800 dark:text-white/90">
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(
              parseFloat(allowance.amount),
            )}
          </span>
        </div>
      ))}
    </div>
  </SectionCard>
);
