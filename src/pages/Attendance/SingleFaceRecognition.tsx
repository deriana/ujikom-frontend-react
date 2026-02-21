import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import { useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle2, 
  XCircle, 
  Camera, 
  RefreshCw, 
  Loader2, 
  ShieldCheck, 
  MapPin,
  Info
} from "lucide-react";
import { handleMutation } from "@/utils/handleMutation";
import { useAttendanceStatusToday, useSendSingleAttendance } from "@/hooks/useAttendance";

const SingleAttendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const queryClient = useQueryClient();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { mutateAsync: sendSingleAttendance } = useSendSingleAttendance();
  const { data: attendanceStatus } = useAttendanceStatusToday();

  // 1. Initial Setup (Models & Geolocation)
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error("Gagal memuat model face-api:", err);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCoords({ lat: 0, lng: 0 })
    );

    loadModels();
  }, []);

  // 2. Logic Capture & Send to Backend
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || !isModelsLoaded) return;

    setIsProcessing(true);
    const imageBase64 = webcamRef.current.getScreenshot();
    
    if (imageBase64) {
      setImgSrc(imageBase64);

      try {
        const img = await faceapi.fetchImage(imageBase64);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        // filter out low-score ghost detections
        if (detection && detection.detection.score > 0.6) {
          const blob = await imageBase64ToBlob(imageBase64);
          
          await handleMutation(
            () => sendSingleAttendance({
              descriptor: Array.from(detection.descriptor),
              latitude: coords?.lat || 0,
              longitude: coords?.lng || 0,
              photo: blob,
            }),
            {
              loading: "Processing face recognition...",
              success: "✅ Attendance recorded successfully!",
              error: "Failed to record attendance",
            }
          );
          
          // Invalidate and refetch attendance status
          await queryClient.invalidateQueries({ queryKey: ["attendanceStatusToday"] });
          setIsSuccess(true);
        } else {
          setIsSuccess(false);
        }
      } catch (error) {
        console.error("Error AI Process:", error);
        setIsSuccess(false);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [webcamRef, isModelsLoaded, coords]);

  const handleReset = () => {
    setImgSrc(null);
    setIsSuccess(null);
    setIsProcessing(false);
  };

  const imageBase64ToBlob = async (base64: string): Promise<Blob> => {
    const res = await fetch(base64);
    return res.blob();
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 flex items-center justify-center font-sans ${
      attendanceStatus?.status === "completed" ? "bg-zinc-50/50 dark:bg-zinc-950/50" : ""
    }`}>
      <div className={`w-full max-w-6xl rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-125 ${
        attendanceStatus?.status === "completed" ? "opacity-75" : ""
      }`}>
        
        {/* KIRI: PANEL KAMERA */}
        <div className={`w-full md:w-7/12 relative bg-zinc-100 dark:bg-black flex items-center justify-center p-4 ${
          attendanceStatus?.status === "completed" ? "grayscale" : ""
        }`}>
          {!imgSrc ? (
            <div className="relative w-full h-full min-h-75 overflow-hidden rounded-4xl">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={true}
                className="w-full h-full object-cover"
              />
              {/* Overlay Gaya CCTV */}
              <div className="absolute inset-0 pointer-events-none border-20 border-black/10"></div>
              <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg"></div>
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-emerald-500 rounded-br-lg"></div>
              
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-white font-bold tracking-widest">LIVE</span>
              </div>
            </div>
          ) : (
            <div className="w-full h-full rounded-4xl overflow-hidden border-4 border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-500">
              <img src={imgSrc} className="w-full h-full object-cover grayscale-[0.2]" alt="Captured" />
            </div>
          )}
        </div>

        {/* KANAN: PANEL STATUS & ACTION */}
        <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-between">
          <div className="space-y-6">
            <div className={`flex items-center gap-2 w-fit px-4 py-1.5 rounded-full border ${
              attendanceStatus?.status === "completed"
                ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-600"
                : "text-emerald-600 bg-emerald-500/10 border-emerald-500/20"
            }`}>
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                {attendanceStatus?.status === "completed" ? "✓ Attendance Complete" : "Biometric Identity"}
              </span>
            </div>

            <div>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                {attendanceStatus?.status === "absent" && "Quick Scan"}
                {attendanceStatus?.status === "clocked_in" && "Clock Out"}
                {attendanceStatus?.status === "completed" && "All Set!"}
              </h2>
              <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
                {attendanceStatus?.status === "absent" && "Arahkan wajah ke kamera dan pastikan pencahayaan cukup untuk verifikasi instan."}
                {attendanceStatus?.status === "clocked_in" && "You've already clocked in. Please face the camera to clock out."}
                {attendanceStatus?.status === "completed" && "Your attendance for today is complete. See you tomorrow!"}
              </p>
            </div>

            {/* Response Area */}
            <div className="pt-4">
              {isSuccess === null ? (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-start gap-4">
                  <Info className="text-zinc-400 mt-1" size={20} />
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {attendanceStatus?.status === "completed"
                      ? "Your attendance is already complete for today."
                      : "Face detection score must be above 60% for accurate attendance recording."}
                  </p>
                </div>
              ) : isSuccess ? (
                <div className="p-8 rounded-4xl bg-emerald-50 dark:bg-emerald-500/5 border-2 border-emerald-500/30 text-center space-y-3 animate-in slide-in-from-bottom-4">
                  <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
                  <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400 tracking-tight">Success!</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-500 opacity-70">Data absensi telah berhasil diverifikasi oleh sistem.</p>
                </div>
              ) : (
                <div className="p-8 rounded-4xl bg-red-50 dark:bg-red-500/5 border-2 border-red-500/30 text-center space-y-3 animate-in slide-in-from-bottom-4">
                  <XCircle className="mx-auto text-red-500" size={56} />
                  <h3 className="text-2xl font-bold text-red-900 dark:text-red-400 tracking-tight">Failed</h3>
                  <p className="text-xs text-red-700 dark:text-red-400 opacity-70">Wajah tidak dikenali atau posisi kurang tepat. Coba lagi.</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 space-y-4">
            {isSuccess === null ? (
              <button
                disabled={!isModelsLoaded || isProcessing || attendanceStatus?.status === "completed"}
                onClick={handleCapture}
                className={`w-full py-5 rounded-2xl font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all ${
                  attendanceStatus?.status === "completed"
                    ? "bg-zinc-300 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 cursor-not-allowed"
                    : "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>SCANNING...</span>
                  </>
                ) : attendanceStatus?.status === "completed" ? (
                  <>
                    <CheckCircle2 size={24} />
                    <span>ATTENDANCE COMPLETED</span>
                  </>
                ) : attendanceStatus?.status === "clocked_in" ? (
                  <>
                    <Camera size={24} />
                    <span>CHECK OUT NOW</span>
                  </>
                ) : (
                  <>
                    <Camera size={24} />
                    <span>CHECK IN NOW</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="w-full py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                <RefreshCw size={20} />
                Try Again
              </button>
            )}

            {/* Koordinat Info */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 font-mono">
              <MapPin size={10} />
              {coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : "Detecting Location..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAttendance;