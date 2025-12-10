import axios from "axios";

export const FILE_SERVER = "https://cs-689104601634.asia-northeast3.run.app";

export const caxios = axios.create({
  baseURL: `https://cs-689104601634.asia-northeast3.run.app/`
});

caxios.interceptors.request.use((config) => {
  if (!config.headers["Authorization"]) {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});