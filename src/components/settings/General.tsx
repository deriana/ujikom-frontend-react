import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import { Globe, Image as ImageIcon, Copyright, Layout } from "lucide-react";

export default function GeneralSetting({ data }: { data: any }) {
  return (
    <ComponentCard title="General Configuration">
      <form className="space-y-8">
        
        {/* Branding Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Site Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Globe size={14} /> Site Name
            </label>
            <Input 
              type="text" 
              value={data.site_name} 
              placeholder="Enter your system name"
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Logo Upload Preview */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <ImageIcon size={14} /> System Logo
            </label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="h-16 w-32 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-2 overflow-hidden">
                <img src={data.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1">
                <input type="file" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-gray-200" />
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Recomended: 512x128px (PNG/WebP)</p>
              </div>
            </div>
          </div>

          {/* Favicon Upload Preview */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Layout size={14} /> Favicon
            </label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="h-16 w-16 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-3">
                <img src={data.favicon} alt="Favicon" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1">
                <input type="file" className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-gray-700 dark:file:text-gray-200" />
                <p className="text-[10px] text-gray-400 mt-1 uppercase">Recomended: 32x32px (ICO/PNG)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-gray-800">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Copyright size={14} /> Footer Text
          </label>
          <Input 
            type="text" 
            value={data.footer} 
            placeholder="© 2026 Your Company"
            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            Save General Changes
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}