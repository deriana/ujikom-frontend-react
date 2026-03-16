import {
  Payroll,
  PayrollCreateInput,
  PayrollDetail,
  PayrollUpdateInput,
} from "@/types/payroll.types";
import api from "./axios";
import { ApiResponse } from "@/types";

export const getPayroll = async (params?: {
  month: string;
}) => {
  const res = await api.get<ApiResponse<Payroll[]>>("/payrolls", { params });
  return res.data.data;
};

export const getPayrollByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<PayrollDetail>>(`/payrolls/${uuid}`);
  return res.data.data;
};

export const createPayroll = async (payload: PayrollCreateInput) => {
  console.log(payload);
  const res = await api.post<ApiResponse<Payroll[]>>("/payrolls", payload);
  return res.data.data;
};

export const updatePayroll = async (
  uuid: string,
  payload: PayrollUpdateInput,
) => {
  const res = await api.put<ApiResponse<Payroll[]>>(
    `/payrolls/${uuid}`,
    payload,
  );
  return res.data.data;
};

export const finalizePayroll = async (uuid: string) => {
  const res = await api.put<ApiResponse<Payroll[]>>(
    `/payrolls/${uuid}/finalize`,
  );
  return res.data.data;
};

export const bulkFinalizePayroll = async (payload: { payroll_uuids: string[] }) => {
  const res = await api.post<ApiResponse<Payroll[]>>(
    "/payrolls/bulk-finalize",
    payload,
  );
  return res.data.data;
};


export const downloadPayroll = async (uuid: string) => {
  const response = await api.get(`/payrolls/${uuid}/download`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `payroll-${uuid}.pdf`);
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export const voidPayroll = async (uuid: string, note: string) => {
  const res = await api.put<ApiResponse<Payroll[]>>(`/payrolls/${uuid}/void`, {
    note,
  });
  return res.data.data;
};

export const exportPayroll = async (params: {
  month?: string;
}) => {
  const res = await api.get("/payrolls/export", {
    params,
    responseType: "blob",
  });
  return res;
};
