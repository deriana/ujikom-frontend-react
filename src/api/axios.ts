import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['ngrok-skip-browser-warning'] = '69420';

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Server tidak merespons atau masalah CORS");
      window.dispatchEvent(new Event("server-down"));
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      console.warn("Sesi berakhir (401). Menghapus token...");
      localStorage.removeItem("token");
    }

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
