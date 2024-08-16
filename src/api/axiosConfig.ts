import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants/apiConstants";

const instance = axios.create({
  baseURL: BASE_URL,
});

//request interceptor
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};

      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
