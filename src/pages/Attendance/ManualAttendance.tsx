import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Camera, 
  FileText, 
  Send, 
  ChevronLeft, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Upload
} from "lucide-react";
import PageHeader from "@/components/Mobile/PageHeader";
import { Home } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useSendManualAttendance } from "@/hooks/useAttendance";
import { handleMutation } from "@/utils/handleMutation";

export default function ManualAttendance() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { mutateAsync: sendManualAttendanceData } = useSendManualAttendance();

  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationError(null);
        },
        (err) => {
          setLocationError("Location access denied. Please enable GPS.");
          console.error(err);
        }
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      reason,
      attachment: attachment as File,
      latitude: coords?.lat || 0,
      longitude: coords?.lng || 0,
    };

    try {
      await handleMutation(
        async () => {
          return await sendManualAttendanceData(payload);
        },
        {
          loading: "Submitting manual attendance...",
          success: "Attendance submitted successfully!",
          error: "Failed to submit attendance",
        }
      );
      navigate("/attendance/menu");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-10">
      {isMobile ? (
        <PageHeader
          icon={Home}
          to="/attendance/menu"
          title="Manual Presence"
          subtitle="Location-based reporting"
        />
      ) : (
        <div className="p-8 max-w-2xl mx-auto">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6">
              <ChevronLeft size={20} /> Back
           </button>
           <h1 className="text-3xl font-black dark:text-white">Manual Attendance</h1>
        </div>
      )}

      <main className="px-6 max-w-2xl mx-auto space-y-6">
        {/* Location Status Card */}
        <div className={`p-5 rounded-3xl border flex items-center gap-4 transition-colors ${coords ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20'}`}>
          <div className={`p-3 rounded-2xl ${coords ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
            <MapPin size={24} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 dark:text-white">Current Node</p>
            <p className="text-sm font-bold dark:text-white">
              {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : (locationError || "Fetching GPS...")}
            </p>
          </div>
          {coords && <CheckCircle2 className="text-emerald-500" size={20} />}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 px-1">
              <FileText size={14} /> Reason for Manual Entry
            </label>
            <textarea 
              placeholder="Describe your reason for manual attendance..."
              className="w-full p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none min-h-32 dark:text-white"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Attachment Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 px-1">
              <Camera size={14} /> Proof Attachment
            </label>
            
            <div className="relative group">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                required
              />
              <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-blue-500">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl mb-3">
                      <Upload className="text-gray-400" size={32} />
                    </div>
                    <p className="text-sm font-bold text-gray-500">Tap to upload photo</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">JPG, PNG or HEIC</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !coords}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-zinc-800 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Send size={20} />
                SUBMIT ATTENDANCE
              </>
            )}
          </button>

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
            <AlertCircle className="text-blue-500 shrink-0" size={18} />
            <p className="text-[10px] font-medium text-blue-700 dark:text-blue-400 leading-relaxed">
              Manual attendance will be reviewed by HR. Ensure your location and reason are accurate to avoid rejection.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}