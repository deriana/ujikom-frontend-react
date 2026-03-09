import { ChevronLeft, MapPin, CheckCircle2, XCircle } from "lucide-react";
import Webcam from "react-webcam";

interface AttendanceMobileComponentProps {
  navigate: (path: number | string) => void;
  imgSrc: string | null;
  webcamRef: React.RefObject<Webcam | null>;
  isProcessing: boolean;
  coords: { lat: number; lng: number } | null;
  isLocationReady: boolean;
  attendanceStatus: any;
  errorMessage: string | null;
  isSuccess: boolean | null;
  isModelsLoaded: boolean;
  handleCapture: () => void;
  handleReset: () => void;
}

export default function AttendanceMobileComponent({
  navigate,
  imgSrc,
  webcamRef,
  isProcessing,
  coords,
  isLocationReady,
  attendanceStatus,
  errorMessage,
  isSuccess,
  isModelsLoaded,
  handleCapture,
  handleReset,
}: AttendanceMobileComponentProps) {
    return (
        <div className="fixed inset-0 bg-black overflow-hidden flex flex-col animate-in fade-in duration-700">
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-linear-to-b from-black/60 to-transparent">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/20"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-white font-bold text-lg tracking-tight">Face Verification</h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>

        {/* Full Screen Camera Background */}
        <div className="absolute inset-0 z-0">
          {!imgSrc ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <img src={imgSrc} className="w-full h-full object-cover" alt="Captured" />
          )}
          
          {/* Scanning Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <div className="relative flex flex-col items-center">
                <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="mt-4 text-white font-black tracking-widest text-sm drop-shadow-md">SCANNING...</span>
              </div>
            </div>
          )}
        </div>

        {/* Glassmorphism Bottom Info Overlay */}
        <div className="mt-auto relative z-10 p-6 space-y-6 bg-linear-to-t from-black/90 via-black/60 to-transparent">
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={16} className="text-indigo-400" />
              <span className="text-xs font-medium font-mono">
                {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "Detecting Location..."}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black text-white">
                {!isLocationReady ? "Detecting Location..." : (
                  <>
                    {attendanceStatus?.status === "absent" && "Check In"}
                    {attendanceStatus?.status === "clocked_in" && "Check Out"}
                    {attendanceStatus?.status === "completed" && "Completed"}
                  </>
                )}
              </h2>
              <p className="text-white/70 text-xs leading-relaxed max-w-xs">
                {!isLocationReady ? "Please wait while we verify your GPS coordinates." : (errorMessage || "Ensure your face is clearly visible and within a well-lit area.")}
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pb-4">
            {!isLocationReady ? (
              <div className="w-full py-5 bg-white/10 border border-white/20 text-white/50 rounded-2xl font-black text-center backdrop-blur-md">
                WAITING FOR GPS...
              </div>
            ) : isSuccess === null ? (
              <button
                disabled={!isModelsLoaded || isProcessing || attendanceStatus?.status === "completed" || !isLocationReady}
                onClick={handleCapture}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 transition-transform disabled:opacity-50"
              >
                {attendanceStatus?.status === "completed" ? "ALREADY CLOCKED" : "TAKE ATTENDANCE"}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-lg active:scale-95 transition-transform"
              >
                TRY AGAIN
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Floating Badge */}
        {isSuccess !== null && (
          <div className={`absolute top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-xl max-w-[80vw]`}>
            {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span className="font-bold text-sm">{isSuccess ? "Success!" : errorMessage || "Failed"}</span>
          </div>
        )}
      </div>
    )
}