import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    Accept: "application/json",
    // "Content-Type": "application/json",
  },
});

// Request interceptor — inject token
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    // if (typeof window !== "undefined") {
    // const token = localStorage.getItem("token")
    // if (token && config.headers) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor — handle 401
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token")
//         localStorage.removeItem("user")

//         window.location.href = "/login"
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default api;
