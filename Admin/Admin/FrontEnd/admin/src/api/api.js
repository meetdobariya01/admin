
import axios from "axios";

const BASE_URL_PRODUCTS = "http://localhost:7000/admin/products";
const BASE_URL_STATS = "http://localhost:7000/api/stats";

// Axios instance with credentials
const axiosInstance = axios.create({
  withCredentials: true,
});

// ===== Product / Category APIs =====
export const getCategories = () => axiosInstance.get(`${BASE_URL_PRODUCTS}/category`);
export const getProducts = () => axiosInstance.get(`${BASE_URL_PRODUCTS}/`);

// ===== Dashboard / Stats APIs =====
export const getAverageSales = () => axiosInstance.get(`${BASE_URL_STATS}/average-sales`);
export const getMonthlySales = () => axiosInstance.get(`${BASE_URL_STATS}/sales-overview`);
export const getUsers = () => axiosInstance.get(`${BASE_URL_STATS}/users`);
export const getPopularProducts = () => axiosInstance.get(`${BASE_URL_STATS}/popular-products`);
