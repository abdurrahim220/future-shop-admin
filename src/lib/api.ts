/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (store) {
      const token = store.getState().auth.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // console.log("res", res);

        const { accessToken, user } = res.data.data;

        // update redux
        if (store) {
          store.dispatch({
            type: "auth/setCredentials",
            payload: {
              accessToken,
              user,
            },
          });
        }

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // refresh failed → logout
        if (store) {
          store.dispatch({ type: "auth/logout" });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
