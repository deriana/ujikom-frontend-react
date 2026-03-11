import api from "./axios";
import { ApiResponse, Assessment, AssessmentDetail, AssessmentInput } from "@/types";

export const getAssessment = async () => {
  const res = await api.get<ApiResponse<Assessment[]>>("/assessments");
  return res.data.data;
};

export const getAssessmentByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<AssessmentDetail>>(`/assessments/${uuid}`);
  return res.data.data;
}

export const createAssessment = async (payload: AssessmentInput) => {
  const res = await api.post<ApiResponse<Assessment[]>>("/assessments",payload);
  return res.data.data;
};

export const updateAssessment = async (uuid: string, payload: AssessmentInput) => {
  const res = await api.put<ApiResponse<Assessment[]>>(`/assessments/${uuid}`,payload);
  return res.data.data;
};

export const deleteAssessment = async (uuid: string) => {
  const res = await api.delete<ApiResponse<Assessment[]>>(`/assessments/${uuid}`);
  return res.data.data;
};

// export const restoreAssessment = async (uuid: string) => {
//   const res = await api.post<ApiResponse<Assessment[]>>(`/assessments/restore/${uuid}`);
//   return res.data.data;
// };

// export const forceDeleteAssessment = async (uuid: string) => {
//   const res = await api.delete<ApiResponse<Assessment[]>>(`/assessments/force-delete/${uuid}`);
//   return res.data.data;
// };

// export const getTrashedAssessment = async () => {
//   const res = await api.get<ApiResponse<Assessment[]>>("/assessments/trashed");
//   return res.data.data;
// }