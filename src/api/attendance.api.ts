import { ApiResponse } from "@/types";
import { BulkAttendanceInput, BulkAttendanceResponse } from "@/types/attendance.types";
import api from "./axios";

export const sendBulkAttendance = async (payload: BulkAttendanceInput) => {
  const formData = new FormData();
  
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  
  payload.attendances.forEach((item, index) => {
    // Tambahkan nama file (misal: face_0.jpg) agar Laravel lebih mudah memprosesnya
    const fileName = `face_${index}.jpg`;
    formData.append(`attendances[${index}][photo]`, item.photo, fileName);
    
    const descriptorValue = typeof item.descriptor === 'string' 
      ? item.descriptor 
      : JSON.stringify(item.descriptor);
      
    formData.append(`attendances[${index}][descriptor]`, descriptorValue);
  });
  
  // Gunakan interface response yang baru kita buat tadi
  const res = await api.post<ApiResponse<BulkAttendanceResponse>>("/attendance/bulk-send", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};