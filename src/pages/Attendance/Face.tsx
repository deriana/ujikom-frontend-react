import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "@vladmandic/face-api";
import { useSendBulkAttendance } from "@/hooks/useAttendance"; 
import { IndividualDetection } from "@/types/attendance.types";

const FaceAttendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const lastSentRef = useRef<number>(0);

  // 1. Integrasi dengan Backend Hook
  const { mutate, isPending } = useSendBulkAttendance();

  useEffect(() => {
    const init = async () => {
      // Ambil lokasi di awal
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: 0, lng: 0 }) // Fallback jika GPS ditolak
      );

      await loadModels();
    };
    init();
  }, []);

  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      // Pastikan model dimuat secara paralel
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      console.log("Models Loaded");
      setIsModelsLoaded(true);
      startVideo();
    } catch (err) {
      console.error("Gagal load model:", err);
    }
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);
  };

  // 2. Fungsi Crop Wajah (Agar yang dikirim kecil/ringan)
  const getFaceBlob = (video: HTMLVideoElement, box: faceapi.Box): Promise<Blob> => {
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
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    
    faceapi.matchDimensions(canvas, displaySize);

    const loop = async () => {
      // Jangan jalankan deteksi jika video berhenti atau sedang mengirim data (isPending)
      if (video.paused || video.ended || isPending) {
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
        // Gambar kotak deteksi
        resizedDetections.forEach((det) => {
          const box = det.detection.box;
          context.strokeStyle = "#00FF00";
          context.lineWidth = 2;
          context.strokeRect(box.x, box.y, box.width, box.height);
        });
      }

      // 3. Logika Pengiriman ke Backend
      const now = Date.now();
      if (resizedDetections.length > 0 && coords && now - lastSentRef.current > 7000) {
        lastSentRef.current = now;
        sendToBackend(resizedDetections);
      }

      requestAnimationFrame(loop);
    };

    loop();
  };

  const sendToBackend = async (detections: any[]) => {
    if (!videoRef.current || !coords) return;

    // Proses semua wajah yang terdeteksi secara paralel
    const attendances: IndividualDetection[] = await Promise.all(
      detections.map(async (det) => {
        const blob = await getFaceBlob(videoRef.current!, det.detection.box);
        return {
          descriptor: Array.from(det.descriptor),
          photo: blob,
        };
      })
    );

    mutate({
      attendances,
      latitude: coords.lat,
      longitude: coords.lng,
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Bulk Face Attendance {isPending && " (Processing...)"}</h1>
      
      {!isModelsLoaded && <p>Loading AI Models...</p>}
      {!coords && <p style={{color: 'orange'}}>Detecting Location...</p>}

      <div style={{ position: "relative", display: "inline-block" }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={handleVideoPlay}
          width={640}
          height={480}
          style={{ border: "3px solid #333", borderRadius: "10px", background: '#000' }}
        />
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </div>

      <div style={{ marginTop: '20px' }}>
         <p>Status: {isPending ? "Mengirim data..." : "Ready untuk scan"}</p>
      </div>
    </div>
  );
};

export default FaceAttendance;