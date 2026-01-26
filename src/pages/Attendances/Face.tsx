import { JSX, useEffect, useRef, useState } from "react";

// =====================
// Type Definitions
// =====================
type AttendanceStatus =
  | "Idle"
  | "Camera access denied"
  | "Face captured"
  | "Sending to API..."
  | "Attendance failed"
  | `Success: ${string}`;

type AttendanceResponse = {
  success: boolean;
  name?: string;
  message?: string;
};

export default function Face(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [status, setStatus] = useState<AttendanceStatus>("Idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // =====================
  // Setup Camera
  // =====================
  useEffect(() => {
    const setupCamera = async (): Promise<void> => {
      try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
        setStatus("Camera access denied");
      }
    };

    setupCamera();

    return () => {
      const tracks = videoRef.current?.srcObject as MediaStream | null;
      tracks?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // =====================
  // Capture Face
  // =====================
  const captureFace = (): void => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBase64: string = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageBase64);
    setStatus("Face captured");
  };

  // =====================
  // Submit Attendance
  // =====================
  const submitAttendance = async (): Promise<void> => {
    if (!capturedImage) return;

    setStatus("Sending to API...");

    try {
      const response: Response = await fetch(
        "http://localhost:8000/api/attendance/face",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: capturedImage,
            device: "web" as const,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      const data: AttendanceResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "API Error");
      }

      setStatus(`Success: ${data.name ?? "Unknown"}`);
    } catch (error) {
      console.error(error);
      setStatus("Attendance failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Face Attendance</h1>

        <div className="relative rounded-xl overflow-hidden border">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured face"
            className="w-full rounded-xl border"
          />
        )}

        <div className="flex gap-2">
          <button
            onClick={captureFace}
            className="flex-1 rounded-xl bg-blue-600 text-white py-2 hover:bg-blue-700"
          >
            Capture
          </button>

          <button
            onClick={submitAttendance}
            disabled={!capturedImage}
            className="flex-1 rounded-xl bg-green-600 text-white py-2 disabled:opacity-50"
          >
            Submit
          </button>
        </div>

        <div className="text-sm text-center text-gray-600">
          Status: {status}
        </div>
      </div>
    </div>
  );
}
