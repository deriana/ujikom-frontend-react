import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import { useUpdateSetting } from "@/hooks/useSetting";
import { GeneralValues } from "@/types";
import { Globe, Image as ImageIcon, Copyright, Layout, UploadCloud } from "lucide-react";
import { useState, useMemo } from "react";
import Form from "../form/Form";
import Button from "../ui/button/Button";
import toast from "react-hot-toast";

export default function GeneralSetting({ data }: { data: GeneralValues }) {
  const { mutateAsync: updateSetting, isPending } = useUpdateSetting<"general">();

  const [siteName, setSiteName] = useState(data.site_name || "");
  const [footer, setFooter] = useState(data.footer || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);

  // UX: Preview gambar sebelum diupload
  const logoPreview = useMemo(() => {
    return logoFile ? URL.createObjectURL(logoFile) : data.logo;
  }, [logoFile, data.logo]);

  const faviconPreview = useMemo(() => {
    return faviconFile ? URL.createObjectURL(faviconFile) : data.favicon;
  }, [faviconFile, data.favicon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("site_name", siteName);
    formData.append("footer", footer);

    if (logoFile) formData.append("logo", logoFile);
    if (faviconFile) formData.append("favicon", faviconFile);

    try {
      await updateSetting({ type: "general", data: formData });
      toast.success("General Settings saved successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <ComponentCard title="General Configuration">
      <Form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Site Name */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Globe size={14} /> Site Name
            </label>
            <Input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter your system name"
            />
          </div>

          {/* Logo Upload - Responsive Fix */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <ImageIcon size={14} /> System Logo
            </label>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="shrink-0 h-20 w-32 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-2 overflow-hidden shadow-sm">
                <img src={logoPreview} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                <label className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-gray-200 rounded-full text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors w-full sm:w-auto">
                  <UploadCloud size={14} className="mr-2" />
                  Choose Logo
                  <input type="file" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} accept="image/*" />
                </label>
                <p className="text-[10px] text-gray-400 uppercase tracking-tight">Recomended: 512x128px (PNG/WebP)</p>
              </div>
            </div>
          </div>

          {/* Favicon Upload - Responsive Fix */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Layout size={14} /> Favicon
            </label>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="shrink-0 h-16 w-16 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center p-3 shadow-sm">
                <img src={faviconPreview} alt="Favicon" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 w-full space-y-2 text-center sm:text-left">
                <label className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 dark:bg-gray-700 text-indigo-700 dark:text-gray-200 rounded-full text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors w-full sm:w-auto">
                  <UploadCloud size={14} className="mr-2" />
                  Choose Favicon
                  <input type="file" className="hidden" onChange={(e) => setFaviconFile(e.target.files?.[0] || null)} accept="image/*" />
                </label>
                <p className="text-[10px] text-gray-400 uppercase tracking-tight">Recomended: 32x32px (ICO/PNG)</p>
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
            value={footer}
            onChange={(e) => setFooter(e.target.value)}
            placeholder="© 2026 Your Company"
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-10 py-3 bg-indigo-600 text-white font-bold shadow-lg transition-all active:scale-[0.98]">
            {isPending ? "Saving..." : "Save General Changes"}
          </Button>
        </div>
      </Form>
    </ComponentCard>
  );
}