import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../baseApi";
import { getAccessToken, refreshToken } from "./auth/authUtils";

const api = axios.create({
  baseURL: API_BASE_URL,
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// auto refresh on 401
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: string | null) => void;
  reject: (reason?: AxiosError) => void;
}[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (original.headers && token) {
              original.headers.Authorization = `Bearer ${token}`;
            }
            return api(original);
          })
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();

        processQueue(null, newAccessToken);

        if (original.headers) {
          original.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return api(original);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        window.dispatchEvent(new Event("logout"));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
