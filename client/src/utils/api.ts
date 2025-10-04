// src/utils/api.ts

import axios from "axios";
import { logout } from "@/auth/session.ts"; 

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  let token: string | null = null;

  // First, try to get a 'user' object and find the token inside it.
  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const user = JSON.parse(userString);
      if (user && user.token) {
        token = user.token;
      }
    } catch (e) {
      console.error("Could not parse user from localStorage", e);
    }
  }

  // If that fails, fall back to looking for a standalone 'token'.
  if (!token) {
    token = localStorage.getItem("token");
  }

  // If a token was found, add it to the headers.
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }

  return config;
});

// 👇 NEW: Auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("🔒 401 Unauthorized — logging out");
      logout("/login"); // redirect to login
    }
    return Promise.reject(err);
  }
);

export default API;
