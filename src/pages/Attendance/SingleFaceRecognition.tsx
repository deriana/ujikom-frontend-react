import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "@vladmandic/face-api";
import { useQueryClient } from "@tanstack/react-query";
import { handleMutation } from "@/utils/handleMutation";
import {
  useAttendanceStatusToday,
  useSendSingleAttendance,
} from "@/hooks/useAttendance";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import GrantedPermission from "@/components/Attendance/Single/GrantedPermisson";
import AttendanceMobileComponent from "@/components/Attendance/Single/MobileComponent";
import AttendanceWebComponent from "@/components/Attendance/Single/WebComponent";

type PermissionStatus = "loading" | "prompt" | "granted" | "denied";

interface PermissionState {
  camera: PermissionStatus;
  location: PermissionStatus;
}

const SingleAttendance: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const [permissions, setPermissions] = useState<PermissionState>({
    camera: "loading",
    location: "loading",
  });

  const { mutateAsync: sendSingleAttendance } = useSendSingleAttendance();
  const { data: attendanceStatus } = useAttendanceStatusToday();

    const handleNavigate = (path: string | number) => {
    navigate(path as any);
  };
  
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
        console.error("Failed to load face-api models:", err);
      }
    };

    checkInitialPermissions();
    loadModels();
  }, []);

  const checkInitialPermissions = async () => {
    try {
      const camStatus = await navigator.permissions.query({ name: "camera" as any });
      const locStatus = await navigator.permissions.query({ name: "geolocation" });

      setPermissions({
        camera: camStatus.state as PermissionStatus,
        location: locStatus.state as PermissionStatus,
      });

      if (locStatus.state === "granted") {
        navigator.geolocation.getCurrentPosition((pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
      }
    } catch (e) {
      // Fallback for browsers that don't support permissions.query for camera
      setPermissions(prev => ({ ...prev, camera: "prompt", location: "prompt" }));
    }
  };

  const requestAccess = async () => {
    let camResult: PermissionStatus = "denied";
    let locResult: PermissionStatus = "denied";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      camResult = "granted";
    } catch (err) {
      camResult = "denied";
    }

    const getLoc = () => new Promise<PermissionStatus>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          resolve("granted");
        },
        () => resolve("denied"),
        { timeout: 5000 }
      );
    });

    locResult = await getLoc();

    setPermissions({ camera: camResult, location: locResult });
  };

  const isAllGranted = permissions.camera === "granted" && permissions.location === "granted";
  const isAnyDenied = permissions.camera === "denied" || permissions.location === "denied";

  const isLocationReady = !!coords;

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

        if (detection && detection.detection.score > 0.6) {
          const blob = await imageBase64ToBlob(imageBase64);

          const payload = {
            descriptor: Array.from(detection.descriptor),
            latitude: coords?.lat || 0,
            longitude: coords?.lng || 0,
            photo: blob,
          };
          console.log("Payload Single Attendance:", payload);

          try {
            setErrorMessage(null); 

            await handleMutation(
              async () => {
                const res = await sendSingleAttendance(payload);
                console.log("Response Single Attendance:", res);
                return res;
              },
              {
                loading: "Processing face recognition...",
                success: "Attendance recorded successfully!",
                error: "Failed to record attendance",
              },
            );
            await queryClient.invalidateQueries({
              queryKey: ["attendanceStatusToday"],
            });
            setIsSuccess(true);
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          } catch (err: any) {
            console.log("Error tertangkap di FE:", err);

            const errMsg =
              err?.response?.data?.message ||
              "Failed to record attendance. Please try again.";

            setErrorMessage(errMsg);
            setIsSuccess(false); 
          }
        } else {
          setIsSuccess(false);
          setErrorMessage(
            "Face not clearly detected or position is incorrect.",
          );
        }
      } catch (error) {
        console.error("Error AI Process:", error);
        setIsSuccess(false);
        setErrorMessage("An error occurred in the camera/AI system.");
      } finally {
        setIsProcessing(false);
      }
    }
  }, [webcamRef, isModelsLoaded, coords, queryClient]); 

  const handleReset = () => {
    setImgSrc(null);
    setIsSuccess(null);
    setIsProcessing(false);
  };

  const imageBase64ToBlob = async (base64: string): Promise<Blob> => {
    const res = await fetch(base64);
    return res.blob();
  };

  // --- PERMISSION PRE-CHECK UI ---
  if (!isAllGranted) {
    return (
      <GrantedPermission
        permissions={permissions}
        isAnyDenied={isAnyDenied}
        requestAccess={requestAccess}
      />
    );
  }

  if (isMobile) {
    return (
      <AttendanceMobileComponent
        attendanceStatus={attendanceStatus}
        coords={coords}
        errorMessage={errorMessage}
        handleCapture={handleCapture}
        handleReset={handleReset}
        imgSrc={imgSrc}
        isLocationReady={isLocationReady}
        isModelsLoaded={isModelsLoaded}
        isProcessing={isProcessing}
        isSuccess={isSuccess}
        navigate={handleNavigate}
        webcamRef={webcamRef}
      />
    );
  }

  return (
    <AttendanceWebComponent
      attendanceStatus={attendanceStatus}
      coords={coords}
      errorMessage={errorMessage}
      handleCapture={handleCapture}
      handleReset={handleReset}
      imgSrc={imgSrc}
      isLocationReady={isLocationReady}
      isModelsLoaded={isModelsLoaded}
      isProcessing={isProcessing}
      isSuccess={isSuccess}
      navigate={handleNavigate}
      webcamRef={webcamRef}
    />
  );
};

export default SingleAttendance;
