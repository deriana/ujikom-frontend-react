import { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import { 
  Loader2, 
  ScanFace, 
  CheckCircle2, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/button/Button";

interface BiometricCaptureProps {
  onCapture: (allDescriptors: number[][]) => void;
  isLoading?: boolean;
}

export const BiometricCapture = ({ onCapture, isLoading }: BiometricCaptureProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [descriptors, setDescriptors] = useState<number[][]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMsg, setStatusMsg] = useState("Initializing AI...");

  const totalRequired = 5;

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
        setStatusMsg("AI Ready. Position your face.");
      } catch (err) {
        console.error("Failed to load model:", err);
        setStatusMsg("Failed to load AI models.");
      }
    };
    loadModels();
  }, []);

  const startAutoScan = useCallback(async () => {
    if (!webcamRef.current || !isModelsLoaded) return;
    
    setIsScanning(true);
    setDescriptors([]);
    setStatusMsg("Scanning... Move your head slightly.");

    let collected: number[][] = [];

    const scanFrame = async () => {
      if (collected.length >= totalRequired) {
        setIsScanning(false);
        setStatusMsg("All samples collected!");
        setDescriptors(collected);
        return;
      }

      const video = webcamRef.current?.video;
      if (video && video.readyState === 4) {
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const currentDescriptor = Array.from(detection.descriptor);
          
          collected.push(currentDescriptor);
          setDescriptors([...collected]);
          setStatusMsg(`Captured ${collected.length}/${totalRequired}`);
        }
      }

      if (collected.length < totalRequired) {
        setTimeout(scanFrame, 600); 
      }
    };

    scanFrame();
  }, [isModelsLoaded]);

  const handleReset = () => {
    setDescriptors([]);
    setIsScanning(false);
    setStatusMsg("AI Ready. Position your face.");
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Visual Feedback: Steps */}
      <div className="w-full max-w-xs flex gap-2">
        {[...Array(totalRequired)].map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < descriptors.length ? "bg-brand-500" : "bg-zinc-200 dark:bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {/* Webcam Preview */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl bg-black">
        {descriptors.length < totalRequired ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={true}
              className="w-full h-full object-cover opacity-80"
            />
            {/* Overlay Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-48 h-48 border-2 border-dashed rounded-full border-brand-500/50 ${isScanning ? 'animate-[spin_8s_linear_infinite]' : ''}`} />
              {isScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-brand-500/50 shadow-[0_0_15px_#brand] animate-[scan_2s_ease-in-out_infinite]" />
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-500/10 gap-3">
             <CheckCircle2 size={64} className="text-emerald-500 animate-in zoom-in" />
             <span className="text-xs font-bold text-emerald-600">READY TO SAVE</span>
          </div>
        )}
      </div>

      {/* Status & Controls */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500">
          {isScanning ? <Loader2 size={16} className="animate-spin text-brand-500" /> : <ScanFace size={16} />}
          {statusMsg}
        </div>

        <div className="flex flex-col gap-3 w-64">
          {descriptors.length < totalRequired ? (
            <Button 
              onClick={startAutoScan} 
              disabled={!isModelsLoaded || isScanning}
              className="rounded-2xl py-6 shadow-lg shadow-brand-500/20"
            >
              {isScanning ? "SCANNING..." : "START AUTO SCAN"}
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => onCapture(descriptors)} 
                disabled={isLoading}
                className="rounded-2xl py-6 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
              >
                {isLoading ? "SAVING DATA..." : "SUBMIT BIOMETRICS"}
              </Button>
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-600 transition"
              >
                <RefreshCw size={14} /> RE-SCAN
              </button>
            </>
          )}
        </div>
      </div>

      {/* Info Warning */}
      <div className="flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl max-w-sm">
        <AlertCircle size={18} className="text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-zinc-500 leading-relaxed text-left">
          Ensure your face is not obscured by a mask or sunglasses. The system will record 5 numerical samples of your face data for precise attendance verification.
        </p>
      </div>
    </div>
  );
};