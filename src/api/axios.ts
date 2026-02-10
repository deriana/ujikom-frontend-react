import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.log(error.response);
    const status = error.response?.status;

    // if (status === 401) {
    //   localStorage.removeItem("token");
    // }

    // if (status === 403) {
    //   window.location.href = "/403";
    // }

    // if (status === 500) {
    //   window.location.href = "/500";
    // }

    // if (status === 503) {
    //   window.location.href = "/503";
    // }

    return Promise.reject(error);
  }

);

export default api;
