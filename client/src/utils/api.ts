// src/utils/api.ts

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

// ✨ FIX: This interceptor is now smarter about finding the token.
API.interceptors.request.use((config) => {
  let token = null;

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
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
