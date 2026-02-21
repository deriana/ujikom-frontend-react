import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, RefreshCw, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button/Button";

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: "user",
};

interface BiometricCaptureProps {
  onCapture: (image: string) => void;
  isLoading?: boolean;
}

export const BiometricCapture = ({ onCapture, isLoading }: BiometricCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
    setIsCameraOpen(true);
  };

  return (
    <div className="space-y-6 text-center">
      {!isCameraOpen && !imgSrc ? (
        /* State 1: Tombol Buka Kamera (Dibuat Lebih Besar & Menarik) */
        <div 
          onClick={() => setIsCameraOpen(true)}
          className="aspect-square max-w-sm mx-auto bg-gray-50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-6 group hover:border-brand-500 hover:bg-brand-500/2 transition-all cursor-pointer"
        >
          <div className="p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-brand-500/10 border border-gray-100 dark:border-gray-700 group-hover:scale-110 transition-transform duration-500">
            <Camera size={48} className="text-brand-500" />
          </div>
          <div className="px-8">
            <p className="text-lg font-bold text-gray-800 dark:text-white">Start Photo Capture</p>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Make sure your face is clearly visible and in a bright place
            </p>
          </div>
        </div>
      ) : isCameraOpen ? (
        /* State 2: Kamera Aktif (Preview Besar) */
        <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-[40px] border-8 border-brand-500 shadow-2xl bg-black transition-all">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            mirrored={true}
            className="h-full w-full object-cover"
          />
          
          {/* Frame Penunjuk (Overlay) agar user tahu posisi wajah */}
          <div className="absolute inset-0 border-40 border-black/20 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="size-64 border-2 border-white/30 rounded-full border-dashed" />
          </div>

          <button 
            type="button"
            onClick={capture}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 p-5 bg-brand-500 text-white rounded-full shadow-2xl hover:bg-brand-600 transition-all active:scale-90 z-10"
          >
            <div className="size-8 border-4 border-white rounded-full" />
          </button>
        </div>
      ) : (
        /* State 3: Hasil Foto (Preview Besar) */
        <div className="space-y-8 animate-in zoom-in-95 duration-300">
          <div className="relative aspect-square max-w-md mx-auto overflow-hidden rounded-[40px] border-8 border-green-500 shadow-2xl group">
            <img src={imgSrc!} alt="Captured" className="h-full w-full object-cover" />
            
            <button 
              type="button"
              onClick={retake}
              className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 rounded-2xl shadow-xl hover:text-brand-500 transition-all backdrop-blur-md"
            >
              <RefreshCw size={24} />
            </button>
            
            <div className="absolute bottom-0 inset-x-0 p-4 bg-green-500 text-white text-xs font-black tracking-[0.2em] uppercase">
              Photo Captured Successfully
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <Button 
              className="w-full py-4 text-lg rounded-2xl shadow-xl shadow-brand-500/20" 
              onClick={() => onCapture(imgSrc!)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Use This Photo"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};