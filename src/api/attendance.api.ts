import { ApiResponse } from "@/types";
import { Attendance, BulkAttendanceInput, BulkAttendanceResponse } from "@/types/attendance.types";
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

export const getAttendance = async (params?: { start_date?: string; end_date?: string }) => {
  const res = await api.get<ApiResponse<Attendance[]>>("/attendances", { params });
  return res.data.data;
};

export const getDetailAttendance = async (id: number) => {
  const res = await api.get<ApiResponse<Attendance>>(`/attendances/${id}`);
  return res.data.data;
};

export const exportAttendances = async (params: { start_date?: string; end_date?: string }) => {
  const res = await api.get("/attendances/export", { params, responseType: "blob" });
  return res;
};