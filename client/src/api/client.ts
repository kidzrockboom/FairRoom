import axios from "axios";
import { API_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});
