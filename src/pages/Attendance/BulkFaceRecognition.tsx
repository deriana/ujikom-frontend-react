import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { useSendBulkAttendance } from "@/hooks/useAttendance";
import { IndividualDetection } from "@/types/attendance.types";

const FaceAttendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const lastSentRef = useRef<number>(0);

  const { mutate, isPending } = useSendBulkAttendance();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const init = async () => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: 0, lng: 0 }),
      );
      await loadModels();
    };
    init();
    return () => clearInterval(timer);
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelsLoaded(true);
      startVideo();
    } catch (err) {
      console.error("Gagal load model:", err);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1280, height: 720 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(console.error);
  };

  const getFaceBlob = (
    video: HTMLVideoElement,
    box: faceapi.Box,
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const tempCanvas = document.createElement("canvas");
      const ctx = tempCanvas.getContext("2d");
      if (!ctx) return;
      const padding = 30;
      const sx = Math.max(0, box.x - padding);
      const sy = Math.max(0, box.y - padding);
      const sw = Math.min(video.videoWidth - sx, box.width + padding * 2);
      const sh = Math.min(video.videoHeight - sy, box.height + padding * 2);
      tempCanvas.width = sw;
      tempCanvas.height = sh;
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);
      tempCanvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", 0.7);
    });
  };

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current || !isModelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = {
      width: video.clientWidth,
      height: video.clientHeight,
    };
    faceapi.matchDimensions(canvas, displaySize);

    const loop = async () => {
      if (video.paused || video.ended) {
        requestAnimationFrame(loop);
        return;
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvas.getContext("2d");

      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        resizedDetections.forEach((det) => {
          const box = det.detection.box;
          // Kotak Deteksi Bergaya Teknis
          context.strokeStyle = "#10b981"; // Emerald-500
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);

          // Label ID/Status mini di atas kotak
          context.fillStyle = "#10b981";
          context.fillRect(box.x, box.y - 20, 70, 20);
          context.fillStyle = "white";
          context.font = "10px Inter, sans-serif";
          context.fillText("DETECTED", box.x + 5, box.y - 6);
        });
      }

      const now = Date.now();
      if (
        resizedDetections.length > 0 &&
        coords &&
        now - lastSentRef.current > 7000 &&
        !isPending
      ) {
        lastSentRef.current = now;
        sendToBackend(detections);
      }

      requestAnimationFrame(loop);
    };
    loop();
  };

  const sendToBackend = async (detections: any[]) => {
    if (!videoRef.current || !coords) return;
    const attendances: IndividualDetection[] = await Promise.all(
      detections.map(async (det) => {
        const blob = await getFaceBlob(videoRef.current!, det.detection.box);
        return {
          descriptor: Array.from(det.descriptor),
          photo: blob,
        };
      }),
    );

    mutate({
      attendances,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8 flex flex-col items-center font-sans text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            Bulk Attendance System
          </h1>
          <p className="text-sm opacity-60 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${isModelsLoaded ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            ></span>
            System Status:{" "}
            {isModelsLoaded ? "Live Monitoring" : "Initializing AI..."}
          </p>
        </div>
        <div className="text-right hidden sm:block text-sm font-mono opacity-80">
          <div>{currentTime.toLocaleDateString()}</div>
          <div>{currentTime.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Main Camera Container */}
      <div className="relative w-[90vw] max-w-7xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 mx-auto">
        {/* CCTV Overlay: Corners */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-white/50"></div>
          <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-white/50"></div>
          <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-white/50"></div>
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-white/50"></div>
        </div>

        {/* REC Indicator */}
        <div className="absolute top-8 left-10 z-20 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-bold tracking-widest drop-shadow-md">
            REC
          </span>
        </div>

        {/* Bottom Status Bar (Glassmorphism) */}
        <div className="absolute bottom-0 inset-x-0 bg-zinc-900/60 backdrop-blur-md border-t border-white/10 p-4 z-20 flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                Coordinates
              </span>
              <span className="text-xs text-white font-mono">
                {coords
                  ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                  : "Searching..."}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400 uppercase tracking-tighter">
                Connection
              </span>
              <span className="text-xs text-white font-mono uppercase tracking-widest">
                Secure_Ujikom_v1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isPending && (
              <span className="flex items-center gap-2 text-emerald-400 text-xs font-medium animate-pulse">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                SYNCING_DATA
              </span>
            )}
          </div>
        </div>

        {/* Video & Canvas */}
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={handleVideoPlay}
          className="w-full h-full object-cover grayscale-20 contrast-125"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
        />

        {/* Loading Models Overlay */}
        {!isModelsLoaded && (
          <div className="absolute inset-0 bg-zinc-950 z-50 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">
              Booting AI Engine...
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        <div className="p-4 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] uppercase font-bold text-zinc-500">
            Method
          </p>
          <p className="text-sm font-semibold">Bulk Face Recognition</p>
        </div>
        <div className="p-4 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-500">
            Auto Scan
          </p>
          <p className="text-sm font-semibold">Enabled (7s Interval)</p>
        </div>
        <div className="p-4 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800 text-right">
          <p className="text-[10px] uppercase font-bold text-zinc-500">
            Security Level
          </p>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            High Reliability
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceAttendance;
