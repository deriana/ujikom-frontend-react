import { ApiResponse } from "@/types";
import { BulkAttendanceInput, BulkAttendanceResponse } from "@/types/attendance.types";
import api from "./axios";

export const sendBulkAttendance = async (payload: BulkAttendanceInput) => {
  const formData = new FormData();
  
  formData.append("latitude", payload.latitude.toString());
  formData.append("longitude", payload.longitude.toString());
  
  payload.attendances.forEach((item, index) => {
    const fileName = `face_${index}.jpg`;
    formData.append(`attendances[${index}][photo]`, item.photo, fileName);
    
    const descriptorValue = typeof item.descriptor === 'string' 
      ? item.descriptor 
      : JSON.stringify(item.descriptor);
      
    formData.append(`attendances[${index}][descriptor]`, descriptorValue);
  });
  
  const res = await api.post<ApiResponse<BulkAttendanceResponse>>("/attendance/bulk-send", formData);

  return res.data.data;
};