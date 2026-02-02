import { ApiResponse } from "@/types";
import api from "./axios";
import { User } from "@/types/auth.types";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  const { token, user } = res.data.data;

  localStorage.setItem("token", token);

  return user;
};

// export const register = async (data: any) => {
//   const res = await api.post("/auth/register", data);

//   const { token, user } = res.data.data;

//   localStorage.setItem("token", token);

//   return user;
// };

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
};

export const getMe = async () => {
  const res = await api.get<ApiResponse<User>>("/auth/me");
  return res.data.data;
};

