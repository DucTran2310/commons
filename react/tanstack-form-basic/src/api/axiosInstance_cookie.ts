import { LOGIN_PAGE_COOKIE } from "@/constants/menus.constants";
import { deleteCookie, getCookie, setCookie } from "@/utils/cookies.utils";
import axios from "axios";

const axiosInstance_cookie = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1",
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token!)));
  failedQueue = [];
};

axiosInstance_cookie.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance_cookie.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getCookie("refresh_token");

      if (!refreshToken) {
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = LOGIN_PAGE_COOKIE;
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance_cookie(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axiosInstance_cookie.post("/auth/refresh-token", { refreshToken });
        setCookie("access_token", data.access_token, 1);
        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return axiosInstance_cookie(originalRequest);
      } catch (err) {
        processQueue(err, null);
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        window.location.href = LOGIN_PAGE_COOKIE;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance_cookie;
