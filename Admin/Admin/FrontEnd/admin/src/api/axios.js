import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/admin",
});

// Add a request interceptor to include token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
