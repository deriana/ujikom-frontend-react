import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
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

const SingleAttendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  // 2. Logic Capture & Dummy Process
  const handleCapture = useCallback(async () => {
    if (!webcamRef.current || !isModelsLoaded) return;

    setIsProcessing(true);
    const imageBase64 = webcamRef.current.getScreenshot();
    
    if (imageBase64) {
      setImgSrc(imageBase64); // Kamera otomatis mati karena unmount

      try {
        const img = await faceapi.fetchImage(imageBase64);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        // Simulasi Delay Loading API (2 detik)
        setTimeout(() => {
          if (detection) {
            const dummyPayload = {
              descriptor: Array.from(detection.descriptor),
              latitude: coords?.lat,
              longitude: coords?.lng,
              timestamp: new Date().toISOString()
            };

            console.log("✅ Data Absensi Berhasil Disiapkan:", dummyPayload);
            setIsSuccess(true);
          } else {
            console.log("❌ Wajah tidak terdeteksi pada gambar.");
            setIsSuccess(false);
          }
          setIsProcessing(false);
        }, 2000);

      } catch (error) {
        console.error("Error AI Process:", error);
        setIsSuccess(false);
        setIsProcessing(false);
      }
    }
  }, [webcamRef, isModelsLoaded, coords]);

  const handleReset = () => {
    setImgSrc(null);
    setIsSuccess(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen 0 p-4 md:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl  rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-125">
        
        {/* KIRI: PANEL KAMERA */}
        <div className="w-full md:w-7/12 relative bg-zinc-100 dark:bg-black flex items-center justify-center p-4">
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
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Biometric Identity</span>
            </div>

            <div>
              <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                Quick Scan
              </h2>
              <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
                Arahkan wajah ke kamera dan pastikan pencahayaan cukup untuk verifikasi instan.
              </p>
            </div>

            {/* Response Area */}
            <div className="pt-4">
              {isSuccess === null ? (
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-start gap-4">
                  <Info className="text-zinc-400 mt-1" size={20} />
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Sistem akan mengekstrak 128 poin wajah Anda secara otomatis untuk keperluan absensi.
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
                disabled={!isModelsLoaded || isProcessing}
                onClick={handleCapture}
                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black text-lg shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>SCANNING...</span>
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