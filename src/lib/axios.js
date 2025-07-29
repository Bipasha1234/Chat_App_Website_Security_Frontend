import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://localhost:4000/api"
    : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
