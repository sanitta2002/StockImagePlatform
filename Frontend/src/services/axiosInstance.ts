import axios from "axios";
import { store } from "../store";
import { clearAccessToken, setAccessToken } from "../store/slices/tokenSlice";
import { clearAuth } from "../store/slices/authSlice";
import { APP_ROUTES } from "../constants/routes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.token?.accessToken;
    console.log("Access token from store:", token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    console.log(error)

    if (status === 401 && !originalRequest._retry && error.response.data.error === "Unauthorized" && error.response.data.message === "Invalid or expired token") {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post('/auth/refresh');
        const newAccessToken = res.data.data.accessToken;

        store.dispatch(setAccessToken(newAccessToken));
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        store.dispatch(clearAccessToken());
        store.dispatch(clearAuth());
        window.location.href = APP_ROUTES.LOGIN;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

