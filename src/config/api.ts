import axios from "axios";

export const externalApiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
}); // TODO: Viacep don't allow "ngrok-skip-browser-warning": true in header so i created this separated instance, soon remove the ngrok header and use apiPublic only

export const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": true,
  },
  withCredentials: true,
});

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": true,
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
