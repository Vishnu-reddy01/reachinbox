import axios from "axios";

const origin = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${origin}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
