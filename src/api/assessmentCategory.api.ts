import api from "./axios";
import { ApiResponse, AssessmentCategory, AssessmentCategoryInput } from "@/types";

export const getAssessmentCategory = async () => {
  const res = await api.get<ApiResponse<AssessmentCategory[]>>("assessment_category");
  return res.data.data;
};

export const createAssessmentCategory = async (payload: AssessmentCategoryInput) => {
  const res = await api.post<ApiResponse<AssessmentCategory[]>>("assessment_category",payload);
  return res.data.data;
};

export const updateAssessmentCategory = async (uuid: string, payload: AssessmentCategoryInput) => {
  const res = await api.put<ApiResponse<AssessmentCategory[]>>(`assessment_category/${uuid}`,payload);
  return res.data.data;
};

export const deleteAssessmentCategory = async (uuid: string) => {
  const res = await api.delete<ApiResponse<AssessmentCategory[]>>(`assessment_category/${uuid}`);
  return res.data.data;
};

export const toggleStatusAssessmentCategory = async (uuid: string) => {
  const res = await api.put<ApiResponse<AssessmentCategory[]>>(`assessment_category/${uuid}/toggle-status`);
  return res.data.data;
};
