import { Fingerprint, Plus, Edit3 } from "lucide-react";
import { SectionCard } from "./ProfileComponent";

export const BiometricCard = ({ hasDescriptor, onAction }: { hasDescriptor: boolean, onAction: () => void }) => (
  <SectionCard title="Biometric Authentication" icon={Fingerprint}>
    <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/1 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className={`size-10 rounded-xl flex items-center justify-center ${
          hasDescriptor ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
        }`}>
          <Fingerprint size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 dark:text-white">Face Descriptor</p>
          <p className="text-xs text-gray-500">
            {hasDescriptor ? "Registered" : "Not Registered"}
          </p>
        </div>
      </div>
      
      <button
        onClick={onAction}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
          hasDescriptor 
            ? 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200' 
            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20'
        }`}
      >
        {hasDescriptor ? <><Edit3 size={14} /> Update Data</> : <><Plus size={14} /> Add Biometric</>}
      </button>
    </div>
  </SectionCard>
);